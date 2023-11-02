import Command from "../Classes/Utils/Command";
import Conversation from "../Classes/Utils/Conversation";

export default class ThanksCommand implements Command {
  public aliases = ["thanks"];
  public description = "Give isla your thanks";
  public usage = "thanks";

  public async run(
    _conversation: Conversation,
    _args: string[]
  ): Promise<string> {
    return "No problem";
  }
}
