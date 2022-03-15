import BaseMessageContext from "src/Classes/Contexts/BaseMessageContext";
import TimeParser from "../Classes/Utils/TimeParser";
import BaseCommand from "./BaseCommand";

export default class RemindmeCommand implements BaseCommand {
  public name = "remindme";
  public aliases = ["remind"];

  public async run(ctx: BaseMessageContext) {
    const time = new TimeParser(ctx.message);

    if (!time.time) {
      await ctx.reply("E-Error, I couldn't figure out the time");
      return ctx.close();
    }

    setTimeout(async () => {
      const text = `${time.matchedText} ago you asked to be reminded of "${time.textWithoutTime}"`;
      await ctx.isla.broadcast(text);
    }, time.time * 1000);
    await ctx.reply(`I'll try to remember it in ${time.matchedText}`);
    ctx.close();
  }
}
