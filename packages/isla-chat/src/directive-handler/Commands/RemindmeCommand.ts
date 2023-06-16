import { TodoistApi } from '@doist/todoist-api-typescript';
import * as assert from 'assert';
import Conversation from 'src/isla-chat/Conversation';
import Command from '../Command';

export default class RemindmeCommand implements Command {
  public aliases = ['remindme', 'remind'];
  public description = 'Adds a todoist reminder';
  public usage = 'remindme <...text>';
  private firstTokensToRemove = ['me', 'to'];

  private todoist: TodoistApi = new TodoistApi(
    process.env.TODOIST_TOKEN || assert.fail('TODOIST_TOKEN not set'),
  );

  public async run(
    _conversation: Conversation,
    args: string[],
  ): Promise<string> {
    let text = args.slice(1);

    // Remove the first tokens
    for (const textBit of text) {
      if (this.firstTokensToRemove.includes(textBit.toLowerCase())) {
        text = text.slice(1);
      } else {
        break;
      }
    }

    const reminder = await this.todoist.addTask({
      content: text.join(' '),
    });

    const project = await this.todoist.getProject(reminder.projectId);

    return `I've added a reminder to ${project.name} for "${reminder.content}"`;
  }
}
