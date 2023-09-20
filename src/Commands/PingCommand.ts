import Conversation from "../Classes/Utils/Conversation";
import Command from "../Classes/Utils/Command";
import KeepAliveService from "../Services/KeepAliveService";
import { AdminGuard } from "../Classes/Utils/AdminGuard";

export default class PingCommand implements Command {
  public aliases = ["ping"];
  public description = "Tells the KeepAliveService that pilot is still alive.";
  public usage = "ping";

  @AdminGuard
  public async run(
    conversation: Conversation,
    _args: string[]
  ): Promise<string> {
    const keepAliveService = conversation.isla.getService(KeepAliveService);
    keepAliveService.ping();
    return "Pong!";
  }
}
