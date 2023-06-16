import { Injectable } from '@nestjs/common';
import Conversation from 'src/isla-chat/Conversation';
import { readdirSync } from 'fs';

import Command from './Command';

@Injectable()
export class DirectiveHandlerService {
  private commands: Command[] = [];

  constructor() {
    const path = __dirname + '/Commands';
    const files = readdirSync(path);
    files.forEach((file) => {
      if (file.endsWith('.js')) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const command = require(`${path}/${file}`);
        this.commands.push(new command.default(this) as Command);
      }
    });
  }

  public async handleDirective(
    conversation: Conversation,
    directive: string,
  ): Promise<string | undefined> {
    const [command, alias] = this.findCommand(this.commands, directive);
    if (!command || !alias) return; // No command found

    const args =
      directive
        .substring(alias.length)
        .trim()
        .match(/[^\s"']+|"([^"]*)"|'([^']*)'/g) ?? new Array<string>();

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

  private findCommand(
    commands: Command[],
    directive: string,
  ): [Command, string] | [undefined, undefined] {
    directive = directive.toLowerCase().replace('"', '').trim();
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
}
