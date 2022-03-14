import BaseMessageContext from "src/Classes/Contexts/BaseMessageContext";

export default class BaseCommand {
  public name = "base";
  public aliases = ["example"];

  public async run(ctx: BaseMessageContext) {
    ctx.reply("This is an example command");
    ctx.close();
  }
}
