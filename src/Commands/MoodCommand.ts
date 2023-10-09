import { SleepBypass } from "../Classes/Utils/SleepBypass";
import { MoodManagerService } from "../Classes/mood/MoodManager";
import Command from "../Classes/Utils/Command";
import Conversation from "../Classes/Utils/Conversation";
import { AdminGuard } from "../Classes/Utils/AdminGuard";

export default class MoodCommand implements Command {
  public aliases = ["mood"];
  public description = "Shows my mood";
  public usage = "mood";

  @AdminGuard
  @SleepBypass
  public async run(
    conversation: Conversation,
    _args: string[]
  ): Promise<string> {
    const isla = conversation.isla;
    const moodManager = isla.getService(MoodManagerService);

    return `I'm currently feeling ${
      moodManager.mood
    }. Raw values: ${JSON.stringify(moodManager.moodInfo)}`;
  }
}
