import Join from "../Utils/Join";
import BaseFrontend from "./BaseFrontend";

export default class JoinFrontend extends BaseFrontend {
  public join = new Join();

  public async start() {
    return;
  }

  public async broadcast(message: string) {
    await this.join.sendNotification(message);
    return;
  }
}
