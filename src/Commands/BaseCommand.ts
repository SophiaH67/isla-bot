import MessageContext from "../Classes/MessageContext";

export default class BaseCommand {
  public name = "base";
  public aliases = ["example"];

  public async run(ctx: MessageContext) {
    ctx.reply("This is an example command");
  }
}
