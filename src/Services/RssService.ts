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

    this.startFeed(feed);

    return feed;
  }

  private startFeed(feed: RssFeed) {
    console.log(`Registering feed ${feed.url}`);

    const existingFeed = this.feeds.get(feed.id);

    if (existingFeed) {
      clearInterval(existingFeed);
    }

    this.feeds.set(
      feed.id,
      setInterval(() => this.checkFeed(feed), RssService.CHECK_INTERVAL)
    );
  }

  private getPublishedDate(item: Parser.Item) {
    //@ts-expect-error - Weird typings, also thx github for using atom instead of xss
    const dateStr = item.pubDate || item.isoDate || item.published;

    if (!dateStr) {
      return new Date(0);
    }

    return new Date(dateStr);
  }

  private async checkFeed(feed: RssFeed) {
    const channel = this.isla.getChannel(feed.syncFrontend, feed.syncChannel);

    const { items } = await this.parser.parseURL(feed.url);
    const newItems = items.filter((item) => {
      return this.getPublishedDate(item) > feed.lastChecked;
    });

    for (const item of newItems) {
      await this.isla.sendMessage(channel, `${item.title} - ${item.link}`);
    }

    await this.prisma.rssFeed.update({
      where: { id: feed.id },
      data: { lastChecked: new Date() },
    });
  }
}
