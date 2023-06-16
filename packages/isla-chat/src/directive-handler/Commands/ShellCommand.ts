import cp from 'child_process';
import Conversation from 'src/isla-chat/Conversation';
import Command from '../Command';

/**
 * DataSpooler is a class that data can be written to so that it comes
 * out in the order it was written. This is useful, since, for example,
 * with the shell command, if a lot of data is written to stdout, the
 * process can exit before all of the data is written to the channel.
 * This means that the status code is written in the middle of the data
 * that was written to stdout, which is not what we want.
 */
class DataSpooler {
  private data: string[] = [];
  private _isSpooling = false;
  private afterSpoolingCallback: ((value?: unknown) => void) | null = null;

  public get isSpooling() {
    return this._isSpooling;
  }

  constructor(private writeToChannel: (data: string) => unknown) {}

  private async spool() {
    this._isSpooling = true;
    while (this.data.length > 0) {
      const data = this.data.shift();
      if (!data?.trim()) continue;
      await this.writeToChannel(data);
    }
    this._isSpooling = false;
    if (this.afterSpoolingCallback) this.afterSpoolingCallback();
  }

  public write(data: string) {
    this.data.push(data);
    if (!this._isSpooling) {
      this.spool();
    }
  }

  public flush() {
    return new Promise((resolve) => {
      if (!this._isSpooling) {
        resolve(undefined);
        return;
      }
      this.afterSpoolingCallback = resolve;
    });
  }
}

export default class ShellCommand implements Command {
  public description = 'Execute a shell command';
  public usage = 'shell <command>';
  public aliases = ['shell ', 'sh ', '!', 'eval '];

  private allowedUsers = ['178210163369574401', '231446107794702336'];

  public run(conversation: Conversation, args: string[]): Promise<string> {
    if (!this.allowedUsers.includes(conversation.messages[0].author.id)) {
      return Promise.resolve('You are not allowed to use this command');
    }
    const [command, ...commandArgs] = args.slice(1);

    // Pipe the output of the command to the channel
    const child = cp.spawn(command, commandArgs, {
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    const spooler = new DataSpooler((data) => conversation.write(data));

    child.stdout.on('data', (data) => spooler.write(data.toString()));
    child.stderr.on('data', (data) => spooler.write(data.toString()));

    return new Promise((resolve) => {
      child.on('close', async (code) => {
        await spooler.flush();
        resolve(`Process exited with code ${code}`);
      });
    });
  }
}
