import { Scraper } from "@the-convocation/twitter-scraper";
import { IslaMessage } from "../Classes/interfaces/IslaMessage";
import { BaseService } from "./BaseService";

export default class TwitterEmbedService extends BaseService {
  private twitter = new Scraper();

  async onMessage(message: IslaMessage): Promise<void> {
    // Get all the links in the message
    const links = message.content.match(
      /https?:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9_]+\/status\/[0-9]+/g
    );

    for (const link of links || []) {
      // Get the tweet ID
      const id = link.match(/status\/([0-9]+)/)?.[1];
      if (!id) {
        continue;
      }

      // Get the tweet
      const tweet = await this.twitter.getTweet(id);

      if (!tweet) {
        continue;
      }

      let replyText = "";

      if (tweet.inReplyToStatus) {
        replyText = `In reply to @${tweet.inReplyToStatus.username}\n\n`;
      }

      replyText += `> ${tweet.text}\n\n@${tweet.username}`;

      await message.reply(replyText, {
        forceThread: true,
        platformNativeReply: false,
        media: tweet.photos.map((p) => p.url),
      });
    }
  }
}
