import Command from "../Classes/Utils/Command";
import Conversation from "../Classes/Utils/Conversation";
import { inspect } from "util";

export default class DebugConversationCommand implements Command {
  public aliases = ["debugconversation"];
  public description = "Gives information about the current conversation";
  public usage = "debugconversation";

  public async run(
    conversation: Conversation,
    _args: string[]
  ): Promise<string> {
    conversation.writeRaw(
      `
Messages: ${conversation.messages.length}
Directives: ${inspect(conversation.directives)}
      `.trim(),
      true
    );

    return "";
  }
}
