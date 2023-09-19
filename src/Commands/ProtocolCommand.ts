import ProtocolService, { Protocol } from "../Services/ProtocolService";
import Command from "../Classes/Utils/Command";
import Conversation from "../Classes/Utils/Conversation";

export default class ProtocolCommand implements Command {
  public aliases = ["protocol"];
  public description = "Changes protocol";
  public usage = "protocol <1|2|3>";

  public async run(
    _conversation: Conversation,
    args: string[]
  ): Promise<string> {
    const protocol = parseInt(args[1]);
    if (isNaN(protocol) || !Object.values(Protocol).includes(protocol))
      return "Invalid protocol";

    const protocolService = _conversation.isla.getService(ProtocolService);

    await protocolService.setProtocol(protocol);

    return `Protocol changed to ${protocol}`;
  }
}
