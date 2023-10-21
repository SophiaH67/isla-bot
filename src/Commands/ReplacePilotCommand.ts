import { LevelGuard } from "../Classes/Utils/PilotGuard";
import Command from "../Classes/Utils/Command";
import Conversation from "../Classes/Utils/Conversation";
import { UserService } from "../Services/UserService";
import { t } from "../Classes/mood/dicts";
import { UserLevel } from "@prisma/client";

export default class ReplacePilotCommand implements Command {
  public aliases = ["replacepilot"];
  public description = "Replace Isla's pilot in case of emergency";
  public usage = "replacepilot";

  @LevelGuard(UserLevel.COPILOT)
  public async run(
    conversation: Conversation,
    _args: string[]
  ): Promise<string | undefined> {
    const isla = conversation.isla;
    const userService = isla.getService(UserService);
    const author = conversation.reference.author;

    await userService.transferPilotship(
      author.id,
      conversation.reference.channel.frontend.constructor.name
    );

    return t(conversation, "replacepilot");
  }
}
