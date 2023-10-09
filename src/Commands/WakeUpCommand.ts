import { MoodManagerService } from "../Classes/mood/MoodManager";
import Command from "../Classes/Utils/Command";
import Conversation from "../Classes/Utils/Conversation";
import Mood from "../Classes/mood/Moods";
import { AwakeState } from "../Classes/mood/states/AwakeState";
import { AdminGuard } from "../Classes/Utils/AdminGuard";
import { SleepBypass } from "../Classes/Utils/SleepBypass";
import { t } from "../Classes/mood/dicts";

export default class WakeUpCommand implements Command {
  public aliases = ["wake", "wakeup"];
  public description = "Attempts to wake me up";
  public usage = "wake up";

  @AdminGuard
  @SleepBypass
  public async run(
    conversation: Conversation,
    _args: string[]
  ): Promise<string> {
    const isla = conversation.isla;

    const moodManager = isla.getService(MoodManagerService);

    if (moodManager.mood === Mood.IslaAsleep) {
      moodManager.switchState(AwakeState);
    }

    return t(conversation, "wakeUpCommand");
  }
}
