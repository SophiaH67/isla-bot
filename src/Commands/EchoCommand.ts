import { AdminGuard } from "../Classes/Utils/AdminGuard";
import Command from "../Classes/Utils/Command";
import Conversation from "../Classes/Utils/Conversation";

export default class EchoCommand implements Command {
  public aliases = ["echo"];
  public description = "Echoes the given text";
  public usage = "echo <text>";

  @AdminGuard
  public async run(
    _conversation: Conversation,
    args: string[]
  ): Promise<string> {
    return args.slice(1).join(" ");
  }
}
