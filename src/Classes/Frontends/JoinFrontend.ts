import Join from "../Utils/Join";
import BaseFrontend from "./BaseFrontend";

export default class JoinFrontend extends BaseFrontend {
  private join: Join;

  constructor() {
    super();

    this.join = new Join();
  }

  public async broadcast(message: string) {
    await this.join.sendNotification(message, true);
    return;
  }
}
