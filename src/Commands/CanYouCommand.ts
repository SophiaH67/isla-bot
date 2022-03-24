import BaseMessageContext from "src/Classes/Contexts/BaseMessageContext";
import BaseCommand from "./BaseCommand";

export default class CanYouCommand implements BaseCommand {
  public name = "can you";
  public aliases: string[] = [
    "can",
    "could",
    "you",
    "isla",
    "please",
    "tell",
    "me",
    "about",
    "the",
    "<@!952582449437765632>",
    "just",
  ];

  public async run(ctx: BaseMessageContext) {
    const newMessage = ctx.message.replace(ctx.command, "").trim();

    ctx.message = newMessage;
    ctx.command = "";
    ctx.args = [];

    await ctx.frontend.commandHandler.handleMessage(ctx);
  }
}
