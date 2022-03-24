import fs from "fs";
import path from "path";
import BaseCommand from "../Commands/BaseCommand";
import BaseMessageContext from "./Contexts/BaseMessageContext";

export default class CommandHandler {
  private commands: { [key: string]: BaseCommand } = {};

  constructor() {
    // Load all .js files in the Commands directory
    const commandFiles = fs.readdirSync(path.join(__dirname, "../Commands"));
    for (const file of commandFiles) {
      if (file.endsWith(".js")) {
        const command = require(path.join(__dirname, "../Commands", file));
        const commandInstance: BaseCommand = new command.default();
        this.commands[commandInstance.name] = commandInstance;
        // Add aliases
        for (const alias of commandInstance.aliases) {
          this.commands[alias.toLowerCase()] = commandInstance;
        }
      }
    }
  }

  public async handleMessage(ctx: BaseMessageContext) {
    await ctx.init();

    let commandInstance: BaseCommand | undefined;
    let commandName = "";
    const searchMessage = ctx.message.toLowerCase().trim();

    commandSearchLoop: for (const command in this.commands) {
      for (const alias of [command, ...this.commands[command].aliases]) {
        if (searchMessage.startsWith(alias)) {
          commandInstance = this.commands[command];
          commandName = ctx.message.substring(0, alias.length);
          break commandSearchLoop;
        }
      }
    }

    if (!commandInstance) {
      return ctx.close();
    }

    if (ctx.isla.moodManager.mood === "asleep") {
      await ctx.reply("Zzzz...");
      return ctx.close();
    }

    ctx.command = commandName;
    ctx.args = ctx.message.replace(ctx.command, "").trim().split(" ");
    await commandInstance.run(ctx);
  }
}
