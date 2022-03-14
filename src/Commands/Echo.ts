import BaseMessageContext from "src/Classes/Contexts/BaseMessageContext";
import BaseCommand from "./BaseCommand";

export default class EchoCommand implements BaseCommand {
  public name = "echo";
  public aliases = [];

  public async run(ctx: BaseMessageContext) {
    ctx.reply(ctx.args.join(" "));
  }
}
