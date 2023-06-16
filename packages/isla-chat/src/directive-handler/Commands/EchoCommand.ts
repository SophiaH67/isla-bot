import Conversation from 'src/isla-chat/Conversation';
import Command from '../Command';

export default class EchoCommand implements Command {
  public aliases = ['echo'];
  public description = 'Echoes the given text';
  public usage = 'echo <text>';

  public async run(
    _conversation: Conversation,
    args: string[],
  ): Promise<string> {
    return args.slice(1).join(' ');
  }
}
