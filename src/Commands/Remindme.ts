import BaseMessageContext from "src/Classes/Contexts/BaseMessageContext";
import TimeParser from "../Classes/Utils/TimeParser";
import BaseCommand from "./BaseCommand";

export default class RemindmeCommand implements BaseCommand {
  public name = "remindme";
  public aliases = ["remind"];

  public async run(ctx: BaseMessageContext) {
    const time = new TimeParser(ctx.message);

    if (!time.time) {
      ctx.reply("E-Error, I couldn't figure out the time");
      return ctx.close();
    }

    ctx.reply(`I'll try to remember it in ${time.time}s`);
    setTimeout(() => {
      ctx.reply(`I remembered your message: \`\`\`${ctx.message}\`\`\``);
      ctx.close();
    }, time.time * 1000);
  }
}
