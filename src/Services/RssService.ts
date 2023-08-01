import { BaseService } from "./BaseService";
import Isla from "../Classes/Isla";
import { PrismaService } from "./PrismaService";
import { RssFeed } from "@prisma/client";
import Parser from "rss-parser";

export class RssService implements BaseService {
  private static CHECK_INTERVAL = 1000 * 60 * 1;

  private parser: Parser;
  private prisma!: PrismaService;
  private isla!: Isla;
  private feeds: Map<string, NodeJS.Timeout>;

  constructor() {
    this.parser = new Parser();
    this.feeds = new Map();
  }

  public async onReady(isla: Isla): Promise<void> {
    this.isla = isla;
    this.prisma = this.isla.getService<PrismaService>(PrismaService);

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
      })
      .catch(() => null);

    if (!deletedFeed) {
      return null;
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
          this.checkFeed(feed.id).catch((e) =>
            console.error(`Error checking feed ${feed.id} (${feed.url}):`, e)
          ),
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

    const { items: allItems } = await this.parser.parseURL(feed.url);
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
          new Date(a.isoDate || a.pubDate || a.date || 0).getTime() -
          new Date(b.isoDate || b.pubDate || b.date || 0).getTime()
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
  }
}
