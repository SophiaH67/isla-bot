import assert from "assert";
import { Client, Intents } from "discord.js";
import { ErisClient } from "eris-boreas";
import BaseFrontend from "./Frontends/BaseFrontend";
import MoodManager from "./mood/MoodManager";

export default class Isla extends ErisClient {
  private static _instance: Isla;

  public frontends: BaseFrontend[] = [];
  public moodManager: MoodManager;

  get name() {
    return "Isla";
  }

  public async transformMessage(message?: string) {
    if (!message) {
      return undefined;
    }
    return await this.moodManager.transformMessage(message);
  }

  private constructor() {
    super(
      new Client({
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
      })
    );
    this.moodManager = new MoodManager(this);
    assert(process.env.DISCORD_TOKEN, "DISCORD_TOKEN is not set");
    this.bot.login(process.env.DISCORD_TOKEN);
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public async broadcast(message: string) {
    await Promise.all(
      this.frontends.map((frontend) => frontend.broadcast(message))
    );
  }

  public async onReady(): Promise<void> {
    this.loadCommands(__dirname + "/../Commands");
    super.onReady();
  }
}
