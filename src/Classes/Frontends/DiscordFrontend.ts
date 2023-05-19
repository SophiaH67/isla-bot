import BaseFrontend from "./BaseFrontend";
import Isla from "../Isla";
import Protocol from "../protocol/Protocol";

export default class DiscordFrontend extends BaseFrontend {
  constructor(public isla: Isla) {
    super();
  }

  public async broadcast(message: string): Promise<void> {
    const channel = await this.isla.bot.channels.fetch("750038885404508180");
    if (!channel) {
      throw new Error("Could not find broadcast channel");
    }
    if (channel.type !== "GUILD_TEXT") {
      throw new Error("Channel is not a text channel");
    }
    await channel.send(message);
  }

  public async setProtocol(protocol: Protocol): Promise<void> {
    switch (protocol) {
      case Protocol.Standard:
        this.isla.bot.user?.setStatus("online");
        this.isla.bot.user?.setPresence({
          activities: [],
        });
        break;
      case Protocol.Safety:
        this.isla.bot.user?.setStatus("idle");
        this.isla.bot.user?.setActivity({
          name: "Safety Protocol",
          type: "PLAYING",
        });
        break;
      case Protocol.Emergency:
        this.isla.bot.user?.setStatus("dnd");
        this.isla.bot.user?.setActivity({
          name: "Emergency Protocol",
          type: "PLAYING",
        });
        break;
    }
  }
}
