import Command from "../Classes/Utils/Command";
import Conversation from "../Classes/Utils/Conversation";
import { AdminGuard } from "../Classes/Utils/AdminGuard";

export default class ShellCommand implements Command {
  public description = "Execute a shell command";
  public usage = "shell <command>";
  public aliases = ["eval "];

  @AdminGuard
  public async run(conversation: Conversation, args: string[]): Promise<string> {
    const script = args.join(" ")

    const actionPromise = eval(`(async () => ${script})()`).catch(e => e.toString()).catch(e => 'An unknown error occurred');

    return await actionPromise;
  }
}
