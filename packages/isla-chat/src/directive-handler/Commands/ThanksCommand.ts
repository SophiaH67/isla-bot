import Conversation from 'src/isla-chat/Conversation';
import Command from '../Command';

export default class ThanksCommand implements Command {
  public aliases = ['thanks'];
  public description = 'Give isla your thanks';
  public usage = 'thanks';

  public async run(
    _conversation: Conversation,
    _args: string[],
  ): Promise<string> {
    return 'No problem';
  }
}
