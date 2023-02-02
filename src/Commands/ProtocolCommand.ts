import Command from "eris-boreas/lib/src/conversation/Command";
import Conversation from "eris-boreas/lib/src/conversation/Conversation";
import Isla from "../Classes/Isla";
import Protocol from "../Classes/protocol/Protocol";

export default class EchoCommand implements Command {
  public aliases = ["protocol", "emergency"];
  public description = "Changes current safety protocol";
  public usage = "protocol <protocol>";

  public async run(
    conversation: Conversation,
    args: string[]
  ): Promise<string> {
    let targetProtocol: Protocol | undefined = args.find(
      (arg) =>
        Object.values(Protocol).indexOf(arg.toLowerCase() as Protocol) !== -1
    ) as Protocol | undefined;

    if (!targetProtocol)
      return `Invalid protocol '${
        args[0]
      }'. Valid protocols are: ${Object.values(Protocol).join(", ")}`;

    const isla = conversation.eris as Isla;

    if (targetProtocol === isla.protocolManager.protocol)
      return `Protocol is already set to '${targetProtocol}'`;

    isla.protocolManager.setProtocol(targetProtocol);

    return `Protocol set to '${targetProtocol}'`;
  }
}
