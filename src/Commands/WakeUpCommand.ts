import { MoodManagerService } from "../Classes/mood/MoodManager";
import Command from "../Classes/Utils/Command";
import Conversation from "../Classes/Utils/Conversation";
import Mood from "../Classes/mood/Moods";
import { AwakeState } from "../Classes/mood/states/AwakeState";
import { PilotGuard } from "../Classes/Utils/PilotGuard";
import { SleepBypass } from "../Classes/Utils/SleepBypass";
import { t } from "../Classes/mood/dicts";

export default class WakeUpCommand implements Command {
  public aliases = ["wake", "wakeup"];
  public description = "Attempts to wake me up";
  public usage = "wake up";

  @PilotGuard
  @SleepBypass
  public async run(
    conversation: Conversation,
    _args: string[]
  ): Promise<string> {
    const isla = conversation.isla;

    const moodManager = isla.getService(MoodManagerService);

    const toReturn = t(conversation, "wakeUpCommand");

    if (moodManager.mood === Mood.IslaAsleep) {
      await moodManager.switchState(AwakeState);
    }

    return toReturn;
  }
}
