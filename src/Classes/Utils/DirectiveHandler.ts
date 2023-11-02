import Conversation from "./Conversation";
import Command from "./Command";
import Isla from "../Isla";
import CommandService from "../../Services/CommandService";
import { MoodManagerService } from "../mood/MoodManager";
import Mood from "../mood/Moods";

export function findCommand(
  commands: Command[],
  directive: string
): [Command, string] | [undefined, undefined] {
  directive = directive.toLowerCase().replace('"', "").trim();
  // Look for a command where one of the aliases is the start of the directive
  for (const command of commands) {
    for (const alias of command.aliases) {
      if (directive.toLowerCase().startsWith(alias)) {
        return [command, alias];
      }
    }
  }
  return [undefined, undefined];
}

export default class DirectiveHandler {
  constructor(public isla: Isla) {}

  public async handleDirective(
    conversation: Conversation,
    directive: string
  ): Promise<string | undefined> {
    const commandService = this.isla.getService<CommandService>(CommandService);
    const [command, alias] = findCommand(commandService.commands, directive);
    if (!command || !alias) return; // No command found

    const moodManager = this.isla.getService(MoodManagerService);

    if (
      moodManager.mood === Mood.IslaAsleep &&
      //@ts-expect-error - sleepBypass is set in some decorators
      !command.sleepBypass
    ) {
      return "Zzz...";
    }

    const args =
      directive
        .substring(alias.length)
        .trim()
        .match(/[^\s"']+|"([^"]*)"|'([^']*)'/g)
        ?.map((arg) => arg) ?? [];
    args.unshift(alias);

    try {
      return await command.run(conversation, args);
    } catch (e) {
      if (e instanceof Error) {
        // Print the error + stacktrace
        console.error(e.stack);
      }
      return `there was a problem: ${JSON.stringify(e)}`;
    }
  }
}
