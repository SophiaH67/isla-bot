import { Message } from "discord.js";
import BaseMessageContext from "./BaseMessageContext";

export default class DiscordMessageContext extends BaseMessageContext {
  private discordMessage: Message;

  constructor(discordMessage: Message) {
    super(discordMessage.content, discordMessage.channelId);
    this.discordMessage = discordMessage;
  }

  async _reply(message: string): Promise<any> {
    return this.discordMessage.reply(message);
  }

  close(): void {
    super.close();
    // There is no need to close/flush the message
    return;
  }

  // Discord can never be closed
  get closed(): boolean {
    return false;
  }

  set closed(_: boolean) {
    return;
  }
}
