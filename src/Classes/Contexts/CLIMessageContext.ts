import BaseMessageContext from "./BaseMessageContext";

export default class CLIMessageContext extends BaseMessageContext {
  private bufferedMessage: string;

  constructor(message: string, id: string) {
    super(message, id);
    this.bufferedMessage = "";
  }

  async reply(message: string): Promise<any> {
    await super.reply(message);
    this.bufferedMessage += message + "\n";
    return;
  }

  close(): void {
    super.close();
    console.log(this.bufferedMessage);
    this.bufferedMessage = "";
    return;
  }
}
