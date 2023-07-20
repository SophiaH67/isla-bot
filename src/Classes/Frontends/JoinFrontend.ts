import Isla from "../Isla";
import Protocol from "../protocol/Protocol";
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

  public async setProtocol(protocol: Protocol) {
    let text = "Protocol";

    switch (protocol) {
      case Protocol.Standard:
        text += "Standard";
        break;
      case Protocol.Safety:
        text += "Safety";
        break;
      case Protocol.Emergency:
        text += "Emergency";
        break;
      default:
        console.warn("Unknown protocol", protocol);
        return;
    }

    await this.join.sendPush({
      deviceId: "group.all",
      text,
    });
  }
}
