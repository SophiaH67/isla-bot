import Conversation from './Conversation';

export default abstract class Command {
  public abstract aliases: string[];
  public abstract description: string;
  public abstract usage: string;

  public abstract run(
    conversation: Conversation,
    args: string[]
  ): Promise<string | undefined>;
}
