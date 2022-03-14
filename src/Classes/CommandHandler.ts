import fs from "fs";
import path from "path";
import BaseCommand from "../Commands/BaseCommand";
import MessageContext from "./MessageContext";

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
          this.commands[alias] = commandInstance;
        }
      }
    }
  }

  public handleMessage(ctx: MessageContext) {
    const args = ctx.message.split(" ");
    const command = args.shift();
    if (!command) {
      return;
    }
    if (command in this.commands) {
      this.commands[command].run(ctx);
    }
  }
}
