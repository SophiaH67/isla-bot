import CommandHandler from "../CommandHandler";

export default abstract class BaseFrontend {
  public commandHandler: CommandHandler;

  constructor(commandHandler: CommandHandler) {
    this.commandHandler = commandHandler;
  }

  public abstract start(): Promise<void>;
  public abstract broadcast(message: string): Promise<void>;
}
