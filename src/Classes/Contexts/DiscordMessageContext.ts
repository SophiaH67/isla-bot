import { Message } from "discord.js";
import BaseFrontend from "../Frontends/BaseFrontend";
import BaseMessageContext from "./BaseMessageContext";

export default class DiscordMessageContext extends BaseMessageContext {
  private discordMessage: Message;

  constructor(discordMessage: Message, frontend: BaseFrontend) {
    super(discordMessage.content, discordMessage.channelId, frontend);
    this.discordMessage = discordMessage;
  }

  async _reply(message: string): Promise<any> {
    return this.discordMessage.reply(message).catch((err) => {
      if (err.code === 50013 || err.code === 50035) {
        this.discordMessage.channel.send(message);
      }
    });
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
