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
    const args = ctx.message.split(" ");
    ctx.command = args.shift() || "";
    ctx.args = args;
    let searchCommand = ctx.command.toLowerCase();
    if (searchCommand in this.commands) {
      await this.commands[searchCommand].run(ctx);
    } else {
      ctx.close();
    }
  }
}
