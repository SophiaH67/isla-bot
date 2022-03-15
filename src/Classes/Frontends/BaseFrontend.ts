import CommandHandler from "../CommandHandler";

export default class BaseFrontend {
  public commandHandler: CommandHandler;

  constructor(commandHandler: CommandHandler) {
    this.commandHandler = commandHandler;
  }

  public async start() {
    throw new Error("Not implemented");
  }

  public async broadcast(_message: string) {
    return;
  }
}
