import Command from "eris-boreas/lib/src/conversation/Command";
import Conversation from "eris-boreas/lib/src/conversation/Conversation";

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
