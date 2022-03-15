import { createClient } from "redis";
import Isla from "../Isla";

export default class BaseMessageContext {
  public message: string;
  public id: string;
  public args: string[] = [];
  private _closed: boolean = false;
  public isla: Isla = Isla.Instance;
  private client;

  constructor(message: string, id: string) {
    this.message = message;
    this.id = id;
    this.client = createClient();
  }

  // Closed is a getter/setter so that it can be overridden
  public get closed(): boolean {
    return this._closed;
  }
  public set closed(value: boolean) {
    this._closed = value;
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
    message = await this.isla.moodManager.transformMessage(message);

    if (this.closed) {
      // Dispatch it to the message queue instead
      return await this.client.rPush(`queued:${this.id}`, message);
    }
    return await this._reply(message);
  }

  async _reply(_message: string): Promise<any> {
    // Override this method
    throw new Error("Method not implemented.");
  }

  close(): void {
    this.closed = true;
  }
}
