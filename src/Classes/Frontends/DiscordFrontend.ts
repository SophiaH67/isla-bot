import BaseFrontend from "./BaseFrontend";
import { Client, Intents } from "discord.js";

export default class DiscordFrontend extends BaseFrontend {
  private bot: Client = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
      Intents.FLAGS.GUILD_MESSAGE_TYPING,
      Intents.FLAGS.DIRECT_MESSAGES,
      Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
      Intents.FLAGS.DIRECT_MESSAGE_TYPING,
    ],
    partials: [
      "CHANNEL", // Required to receive DMs
    ],
  });

  constructor() {
    super();
  }

  public async start(): Promise<void> {
    this.bot.login(process.env.DISCORD_TOKEN);

    this.bot.on("ready", () => {
      console.log(`Logged in as ${this.bot.user?.tag}!`);
    });
  }
}
