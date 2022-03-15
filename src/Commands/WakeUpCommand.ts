import BaseMessageContext from "src/Classes/Contexts/BaseMessageContext";
import BaseCommand from "./BaseCommand";

export default class WakeUpCommand implements BaseCommand {
  public name = "wake";
  public aliases = ["wakeup"];

  public async run(ctx: BaseMessageContext) {
    if (ctx.isla.moodManager.sleeping) {
      ctx.isla.moodManager.wakeUp();
      await ctx.reply("What is it that made you wake me up?");
    } else {
      await ctx.reply("I'm already awake!");
    }
    ctx.close();
  }
}
