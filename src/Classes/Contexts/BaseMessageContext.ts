import { createClient } from "redis";

export default class BaseMessageContext {
  public message: string;
  public id: string;
  public args: string[] = [];
  public closed: boolean = false;
  private client;

  constructor(message: string, id: string) {
    this.message = message;
    this.id = id;
    this.client = createClient();
  }

  async init(): Promise<any> {
    await this.client.connect();
    const topMessage = await this.client.lPop(`queued:${this.id}`);
    if (topMessage) {
      // Use the parent class to reply(opposite of super.reply)
      await this.reply(topMessage);
    }
  }

  async reply(message: string): Promise<any> {
    if (this.closed) {
      // Dispatch it to the message queue instead
      await this.client.rPush(`queued:${this.id}`, message);
    }
  }

  close(): void {
    this.closed = true;
  }
}
