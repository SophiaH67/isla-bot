import BaseFrontend from "./BaseFrontend";
import Isla from "../Isla";

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
}
