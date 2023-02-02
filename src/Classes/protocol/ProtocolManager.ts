import Isla from "../Isla";
import Protocol from "./Protocol";

export default class ProtocolManager {
  private _protocol: Protocol = Protocol.Standard;

  constructor(private isla: Isla) {}

  public get protocol(): Protocol {
    return this._protocol;
  }

  public async setProtocol(protocol: Protocol) {
    if (protocol === this._protocol) return;
    this._protocol = protocol;

    const transformedMessage = await this.isla.transformMessage(
      `Protocol set to '${protocol}'`
    );

    this.isla.broadcast(transformedMessage);
    this.isla.frontends.forEach((frontend) => frontend.setProtocol(protocol));
  }
}
