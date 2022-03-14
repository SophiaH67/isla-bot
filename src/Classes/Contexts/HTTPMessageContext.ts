import BaseMessageContext from "./BaseMessageContext";

export default class HTTPMessageContext extends BaseMessageContext {
  private bufferedMessage: string;
  private finishCallback: (message: string) => void;

  constructor(
    message: string,
    id: string,
    finishCallback: (message: string) => void
  ) {
    super(message, id);
    this.bufferedMessage = "";
    this.finishCallback = finishCallback;
  }

  async _reply(message: string): Promise<any> {
    this.bufferedMessage += message + "\n";
    return;
  }

  close(): void {
    super.close();
    this.finishCallback(this.bufferedMessage);
    this.bufferedMessage = "";
    return;
  }
}
