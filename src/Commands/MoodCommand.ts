import BaseMessageContext from "src/Classes/Contexts/BaseMessageContext";
import BaseCommand from "./BaseCommand";

export default class MoodCommand implements BaseCommand {
  public name = "mood";
  public aliases = [];

  public async run(ctx: BaseMessageContext) {
    await ctx._reply(ctx.isla.moodManager.mood);
    ctx.close();
  }
}
