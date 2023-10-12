import Isla from "../Classes/Isla";
import { BaseService } from "./BaseService";
import LoggingService, { Logger } from "./LoggingService";

/**
 * Protocol is global state Isla and Isla-integrated apps should follow.
 * This is meant for safety.
 *
 * LINK_TO_PILOT
 *
 * This means Isla has an active, unmonitored, untampered link to the pilot.
 * Pilot is in no danger and can be fully trusted.
 *
 * UPHOLD_THE_MISSION
 *
 * This is a state manually set by the pilot. This means pilot is in a state
 * of potential danger. Isla should send relevant information to the pilot
 * using logs.
 *
 * PROTECT_THE_PILOT
 *
 * This is a state either manually set by the pilot or automatically promoted
 * to by Isla. This means pilot is in a state of danger. Isla should only share
 * information that is absolutely necessary to the pilot. This state will also
 * initiate a self-destruct sequence after 30 minutes of being in this state.
 *
 * GOODBYE_JACK
 *
 * This is a state set by Isla when the self-destruct sequence has been initiated.
 * This means self-destruct sequence has been initiated and cannot be de-escalated.
 */
export enum Protocol {
  LINK_TO_PILOT = 1,
  UPHOLD_THE_MISSION = 2,
  PROTECT_THE_PILOT = 3,
  GOODBYE_JACK = 4,
}

export default class ProtocolService implements BaseService {
  private _protocol: Protocol | undefined;
  private _protocolTimeout: NodeJS.Timeout | undefined;
  logger!: Logger;

  constructor(loggingService: LoggingService, private readonly isla: Isla) {
    this.logger = loggingService.getLogger(ProtocolService.name);
  }

  async onStart(): Promise<void> {
    await this.isla.onProtocolChange(await this.getProtocol());
  }

  public async getProtocol(): Promise<Protocol> {
    if (this._protocol === undefined) {
      const value = await this.isla.redis.get("isla:protocol");
      if (value) {
        this._protocol = parseInt(value);
      } else {
        this._protocol = Protocol.LINK_TO_PILOT;
      }
    }

    return this._protocol;
  }

  public async setProtocol(protocol: Protocol) {
    if (protocol === this._protocol) {
      await this.logger.debug("Protocol is already set to " + protocol);
      return;
    }

    switch (protocol) {
      case Protocol.LINK_TO_PILOT:
        this.logger.info("Protocol 1, link to pilot");
        break;

      case Protocol.UPHOLD_THE_MISSION:
        this.logger.warn("Protocol 2, uphold the mission");
        break;

      case Protocol.PROTECT_THE_PILOT:
        this.logger.error("Protocol 3, protect the pilot");
        this._protocolTimeout = setTimeout(() => {
          this.setProtocol(Protocol.GOODBYE_JACK);
        }, 1000 * 60 * 30);
        break;
      case Protocol.GOODBYE_JACK:
        break; // Handled by other services listening in on MQTT; Isla-related code is stored in SelfDestructService.ts
    }

    if (protocol !== Protocol.PROTECT_THE_PILOT && this._protocolTimeout) {
      clearTimeout(this._protocolTimeout);
      this._protocolTimeout = undefined;
    }

    this._protocol = protocol;
    await this.isla.redis.set("isla:protocol", protocol);
    await this.isla.onProtocolChange(protocol);
  }

  public async isAtLeast(protocol: Protocol): Promise<boolean> {
    return (await this.getProtocol()) >= protocol;
  }
}
