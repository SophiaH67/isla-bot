import BaseFrontend from "./BaseFrontend";
import Discord from "discord.js";
import CommandHandler from "../CommandHandler";
import assert from "assert";
import DiscordMessageContext from "../Contexts/DiscordMessageContext";

export default class DiscordFrontend extends BaseFrontend {
  private bot: Discord.Client;
  private token: string;

  constructor(commandHandler: CommandHandler, token?: string) {
    assert(token, "Token is required");

    super(commandHandler);
    const intents = new Discord.Intents()
      .add(Discord.Intents.FLAGS.GUILDS)
      .add(Discord.Intents.FLAGS.GUILD_MESSAGES)
      .add(Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS)
      .add(Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING)
      .add(Discord.Intents.FLAGS.GUILD_PRESENCES)
      .add(Discord.Intents.FLAGS.GUILD_VOICE_STATES)
      .add(Discord.Intents.FLAGS.DIRECT_MESSAGES);
    this.bot = new Discord.Client({
      partials: ["MESSAGE", "CHANNEL", "REACTION"],
      intents: intents,
    });
    this.token = token;
  }

  public async start() {
    this.bot.on("ready", () => {
      console.log("Discord bot is ready!");
    });
    this.bot.on("messageCreate", (message) => {
      const ctx = new DiscordMessageContext(message);
      this.commandHandler.handleMessage(ctx);
    });
    this.bot.login(this.token);
  }

  public async broadcast(message: string) {
    const channel = await this.bot.channels.fetch("952584213499093044");
    if (!channel) {
      throw new Error("Could not find broadcast channel");
    }
    if (channel.type !== "DM") {
      throw new Error("Channel is not a text channel");
    }
    const dmChannel = channel as Discord.DMChannel;
    await dmChannel.send(message);
  }
}
