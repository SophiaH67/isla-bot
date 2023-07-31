import Command from "../Classes/Utils/Command";
import Conversation from "../Classes/Utils/Conversation";
import Protocol from "../Classes/protocol/Protocol";

export default class EchoCommand implements Command {
  public aliases = ["protocol", "emergency"];
  public description = "Changes current safety protocol";
  public usage = "protocol <protocol> [override]";

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

    const isla = conversation.isla;

    const override = args.join(" ").toLowerCase().includes("override");

    if (targetProtocol === isla.protocolManager.protocol && !override)
      return `Protocol is already set to '${targetProtocol}'`;

    isla.protocolManager.setProtocol(targetProtocol);

    return `Protocol set to '${targetProtocol}'`;
  }
}