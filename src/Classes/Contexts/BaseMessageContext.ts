export default class BaseMessageContext {
  public message: string;
  public id: string;
  public args: string[] = [];
  public closed: boolean = false;

  constructor(message: string, id: string) {
    this.message = message;
    this.id = id;
  }

  async reply(_message: string): Promise<any> {
    if (this.closed) {
      throw new Error("Context is closed");
    }
  }

  close(): void {
    this.closed = true;
  }
}
