import Command from "eris-boreas/lib/src/conversation/Command";
import Conversation from "eris-boreas/lib/src/conversation/Conversation";
import Isla from "packages/isla/src/Classes/Isla";

export default class WakeUpCommand implements Command {
  public aliases = ["wake", "wakeup"];
  public description = "Attempts to wake me up";
  public usage = "wake up";

  public async run(
    conversation: Conversation,
    _args: string[]
  ): Promise<string> {
    const isla = conversation.eris as Isla;
    if (isla.moodManager.sleeping) {
      isla.moodManager.wakeUp();
      return "Why did you wake me up?";
    } else {
      return "I'm already awake!";
    }
  }
}
