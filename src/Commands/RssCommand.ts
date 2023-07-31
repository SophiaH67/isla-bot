import { PrismaService } from "../Services/PrismaService";
import Command from "../Classes/Utils/Command";
import Conversation from "../Classes/Utils/Conversation";
import { AdminGuard } from "../Classes/Utils/AdminGuard";
import { RssService } from "../Services/RssService";

export default class RssCommand implements Command {
  public aliases = ["rss", "feed"];
  public description = "Manage RSS feeds";
  public usage = "rss <add|remove|list> [args]";

  @AdminGuard
  public async run(
    conversation: Conversation,
    args: string[]
  ): Promise<string> {
    const prisma = conversation.isla.getService<PrismaService>(PrismaService);
    const rssService = conversation.isla.getService<RssService>(RssService);

    if (args[1] === "add") {
      const url = args[2];
      let syncFrontend = args[3];
      let syncChannel = args[4];

      if (!url || (syncFrontend && !syncChannel)) {
        return "Usage: rss add <url> [syncFrontend] [syncChannel]";
      }

      try {
        new URL(url);
      } catch (e) {
        return "Invalid URL";
      }

      if (!syncFrontend) {
        syncFrontend = conversation.reference.channel.frontend.constructor.name;
        syncChannel = conversation.reference.channel.id;
      }

      const feed = await rssService.registerFeed(
        url,
        syncFrontend,
        syncChannel
      );

      return `Added RSS feed ${url} with id ${feed.id}`;
    }

    if (args[1] === "remove") {
      const id = args[2];

      if (!id) {
        return "Usage: rss remove <id>";
      }

      const deletedFeed = await rssService.removeFeed(id);

      if (!deletedFeed) {
        return `No RSS feed with id ${id}`;
      }

      return `Removed RSS feed ${id} (${deletedFeed.url})`;
    }

    if (args[1] === "list") {
      const feeds = await prisma.rssFeed.findMany();

      if (feeds.length === 0) {
        return "No RSS feeds";
      }

      let message = "RSS feeds:\n```\n";
      feeds.forEach((feed) => {
        message += `${feed.id} - ${feed.url}\n`;
      });

      message += "```";

      conversation.write(message, true);

      return "";
    }

    return this.usage;
  }
}
