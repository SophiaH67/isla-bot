export default class MessageContext {
  public message: string;
  public id: string;
  public reply: (message: string) => Promise<void>;

  constructor(
    message: string,
    id: string,
    reply: (message: string) => Promise<any>
  ) {
    this.message = message;
    this.id = id;
    this.reply = reply;
  }
}
