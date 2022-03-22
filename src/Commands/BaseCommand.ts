import BaseMessageContext from "src/Classes/Contexts/BaseMessageContext";

/**
 * BaseCommand
 * The reason this is not an abstract class is because we are loading all
 * commands from the command directory, and we shouldn't initialize an
 * abstract class.s
 */
export default class BaseCommand {
  public name = "base";
  public aliases = ["example"];

  public async run(ctx: BaseMessageContext) {
    await ctx.reply("This is an example command");
    ctx.close();
  }
}
