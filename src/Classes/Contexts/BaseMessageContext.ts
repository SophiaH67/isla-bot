export default class BaseMessageContext {
  public message: string;
  public id: string;
  public args: string[] = [];

  constructor(message: string, id: string) {
    this.message = message;
    this.id = id;
  }

  async reply(_message: string): Promise<any> {
    throw new Error("Method not implemented.");
  }

  close(): void {
    throw new Error("Method not implemented.");
  }
}
