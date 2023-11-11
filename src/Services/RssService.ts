import Isla from "../Classes/Isla";
import { BaseService } from "./BaseService";
import { PrismaService } from "./PrismaService";
import { RssFeed, Prisma } from "@prisma/client";
import Parser from "rss-parser";

function retryCountToWaitTime(retries: number) {
  // Exponential backoff with a max of 24 hours
  const timeInMs = Math.min(
    1000 * 60 * 60 * 1.5 ** (retries - 1), // -1 because we start with no delay
    1000 * 60 * 60 * 24
  );

  return timeInMs;
}

export class RssService implements BaseService {
  private static CHECK_INTERVAL = 1000 * 60 * 1;

  private parser: Parser;
  private feeds: Map<string, NodeJS.Timeout>;

  constructor(
    private readonly prisma: PrismaService,
    private readonly isla: Isla
  ) {
    this.parser = new Parser();
    this.feeds = new Map();
  }

  public async onStart(): Promise<void> {
    for (const feed of await this.prisma.rssFeed.findMany()) {
      this.startFeed(feed);
    }
  }

  public async registerFeed(
    url: string,
    syncFrontend: string,
    syncChannel: string
  ) {
    const feed = await this.prisma.rssFeed.create({
      data: {
        url,
        syncFrontend,
        syncChannel,
      },
    });

    await this.initializeFeed(feed.id);

    this.startFeed(feed);

    return feed;
  }

  public async removeFeed(id: string) {
    const deletedFeed = await this.prisma.rssFeed
      .delete({
        where: { id },
        include: { RssFeedSeen: true },
      })
      .catch((e) => e as Error);

    if (
      deletedFeed instanceof Prisma.PrismaClientKnownRequestError &&
      deletedFeed.code === "P2025"
    ) {
      return null;
    }

    if (deletedFeed instanceof Error) {
      throw deletedFeed;
    }

    clearInterval(this.feeds.get(id));

    return deletedFeed;
  }

  private startFeed(feed: RssFeed) {
    console.log(`Registering feed ${feed.url}`);

    const existingFeed = this.feeds.get(feed.id);

    if (existingFeed) {
      clearInterval(existingFeed);
    }

    this.feeds.set(
      feed.id,
      setInterval(
        () =>
          this.checkFeed(feed.id)
            .catch((e) =>
              console.error(`Error checking feed ${feed.id} (${feed.url}):`, e)
            )
            .finally(() => {
              this.prisma.rssFeed.update({
                where: { id: feed.id },
                data: {
                  lastSync: new Date(),
                },
              });
            }),
        RssService.CHECK_INTERVAL
      )
    );
  }

  private getTracker(item: Parser.Item) {
    const tracker = item.guid || item.link || item.title;

    if (!tracker) {
      console.error("No tracker found for item", item);
      throw new Error("No tracker found");
    }

    return tracker;
  }

  private async initializeFeed(feedId: string) {
    const feed = await this.prisma.rssFeed.findUnique({
      where: { id: feedId },
    });

    if (!feed) return;

    const { items } = await this.parser.parseURL(feed.url);

    const promises = items
      .map((item) => this.getTracker(item))
      .map((tracker) =>
        this.prisma.rssFeedSeen.create({
          data: {
            tracker,
            feed: { connect: { id: feedId } },
          },
        })
      );

    await Promise.all(promises);
  }

  private async checkFeed(feedId: string) {
    const feed = await this.prisma.rssFeed.findUnique({
      where: { id: feedId },
    });

    if (!feed) return;

    // Get the number of retries and wait if necessary
    const timeInMs = retryCountToWaitTime(feed.retries);
    const onlySyncAfter = feed.lastSync.getTime() + timeInMs;
    if (onlySyncAfter > Date.now()) {
      return;
    }

    // If there are no items, initialize the feed
    const seenItems = await this.prisma.rssFeedSeen.count({
      where: { feedId: feed.id },
    });
    if (seenItems === 0) {
      console.warn(
        `Feed ${feed.id} (${feed.url}) has no seen items, initializing`
      );
      await this.initializeFeed(feed.id);
      return;
    }

    const channel = this.isla.getChannel(feed.syncFrontend, feed.syncChannel);

    let allItems: Parser.Item[];
    try {
      const res = await this.parser.parseURL(feed.url);
      allItems = res.items;
    } catch (e) {
      await this.prisma.rssFeed.update({
        where: { id: feed.id },
        data: {
          retries: {
            increment: 1,
          },
          lastError: e instanceof Error ? e.message : "" + e,
        },
      });

      return;
    }
    // Filter out items we've already seen
    const itemIndices = await Promise.all(
      allItems.map((item) =>
        this.prisma.rssFeedSeen.count({
          where: {
            feedId: feed.id,
            tracker: this.getTracker(item),
          },
        })
      )
    );
    const items = allItems
      .filter((_, i) => itemIndices[i] === 0)
      .sort(
        (a, b) =>
          new Date(a.isoDate || a.pubDate || (a as any).date || 0).getTime() -
          new Date(b.isoDate || b.pubDate || (b as any).date || 0).getTime() // Sort by date, oldest first
      ); // Sort by date, oldest first

    for (const item of items) {
      await this.isla.sendMessage(channel, `${item.title} - ${item.link}`);

      await this.prisma.rssFeedSeen.create({
        data: {
          tracker: this.getTracker(item),
          feed: { connect: { id: feed.id } },
        },
      });
    }

    await this.prisma.rssFeed.update({
      where: { id: feed.id },
      data: {
        retries: 0,
      },
    });
  }
}
