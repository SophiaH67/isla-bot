import Command from "../Classes/Utils/Command";
import Conversation from "../Classes/Utils/Conversation";

export default class WakeUpCommand implements Command {
  public aliases = ["wake", "wakeup"];
  public description = "Attempts to wake me up";
  public usage = "wake up";

  public async run(
    conversation: Conversation,
    _args: string[]
  ): Promise<string> {
    const isla = conversation.isla;
    if (isla.moodManager.sleeping) {
      isla.moodManager.wakeUp();
      return "Why did you wake me up?";
    } else {
      return "I'm already awake!";
    }
  }
}
