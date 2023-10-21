import Command from "../Classes/Utils/Command";
import Conversation from "../Classes/Utils/Conversation";
import { PilotGuard } from "../Classes/Utils/PilotGuard";
import { t } from "../Classes/mood/dicts";

export default class EvalCommand implements Command {
  public description = "Execute javascript within an asynchronous enclosure";
  public usage = "eval <script>";
  public aliases = ["eval "];

  @PilotGuard
  public async run(
    conversation: Conversation,
    args: string[]
  ): Promise<string> {
    const script = args.slice(1).join(" ");

    const actionPromise = eval(`(async () => ${script})()`)
      .then((result: unknown) => "" + result)
      .catch((e: Error) => e.toString())
      .catch((_e: Error) => t(conversation, "unknownEvalError"));

    return await actionPromise;
  }
}
