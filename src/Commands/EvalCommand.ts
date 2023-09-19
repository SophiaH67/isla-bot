import Command from "../Classes/Utils/Command";
import Conversation from "../Classes/Utils/Conversation";
import { AdminGuard } from "../Classes/Utils/AdminGuard";

export default class ShellCommand implements Command {
  public description = "Execute a shell command";
  public usage = "shell <command>";
  public aliases = ["eval "];

  @AdminGuard
  public async run(
    _conversation: Conversation,
    args: string[]
  ): Promise<string> {
    const script = args.slice(1).join(" ");

    const actionPromise = eval(`(async () => ${script})()`)
      .then((result: unknown) => "" + result)
      .catch((e: Error) => e.toString())
      .catch((_e: Error) => "An unknown error occurred");

    return await actionPromise;
  }
}
