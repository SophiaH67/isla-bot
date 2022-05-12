import Command from "eris-boreas/lib/src/conversation/Command";
import Conversation from "eris-boreas/lib/src/conversation/Conversation";
import Isla from "src/Classes/Isla";

export default class MoodCommand implements Command {
  public aliases = ["mood"];
  public description = "Shows my mood";
  public usage = "mood";

  public async run(
    conversation: Conversation,
    _args: string[]
  ): Promise<string> {
    return `I'm currently feeling ${
      (conversation.eris as Isla).moodManager.mood
    }`;
  }
}
