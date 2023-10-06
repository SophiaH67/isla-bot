import { MoodManagerService } from "../Classes/mood/MoodManager";
import Command from "../Classes/Utils/Command";
import Conversation from "../Classes/Utils/Conversation";
import Mood from "../Classes/mood/Moods";
import { AwakeState } from "../Classes/mood/states/AwakeState";

export default class WakeUpCommand implements Command {
  public aliases = ["wake", "wakeup"];
  public description = "Attempts to wake me up";
  public usage = "wake up";

  public async run(
    conversation: Conversation,
    _args: string[]
  ): Promise<string> {
    const isla = conversation.isla;

    const moodManager = isla.getService(MoodManagerService);

    if (moodManager.mood === Mood.Asleep) {
      moodManager.switchState(AwakeState);
      return "Why did you wake me up?"; //TODO: Translation key for waking up!
    } else {
      return "I'm already awake!";
    }
  }
}
