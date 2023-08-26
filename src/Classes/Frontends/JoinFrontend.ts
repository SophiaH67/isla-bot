import Isla from "../Isla";
import Join from "../Utils/Join";
import BaseFrontend from "./BaseFrontend";

export default class JoinFrontend extends BaseFrontend {
  private join: Join;

  constructor(private isla: Isla) {
    super();

    this.join = new Join(this.isla);
  }

  public async broadcast(message: string) {
    await this.join.sendNotification(message);
    return;
  }
}
