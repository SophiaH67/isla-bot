import Isla from "src/Classes/Isla";
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
 */
export enum Protocol {
  LINK_TO_PILOT = 1,
  UPHOLD_THE_MISSION = 2,
  PROTECT_THE_PILOT = 3,
}

export default class ProtocolService extends BaseService {
  private _protocol: Protocol = Protocol.LINK_TO_PILOT;
  private _protocolTimeout: NodeJS.Timeout | undefined;
  logger!: Logger;

  onReady(isla: Isla): Promise<void> {
    const loggingService = isla.getService(LoggingService);
    this.logger = loggingService.getLogger(ProtocolService.name);

    this.logger.debug("Protocol service is ready");

    return Promise.resolve();
  }

  public getProtocol(): Protocol {
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
          this.logger.warn(
            "Protocol 3 has been active for 30 minutes. Initiating self-destruct sequence."
          );
        }, 1000 * 60 * 30);
        break;
    }

    if (protocol !== Protocol.PROTECT_THE_PILOT && this._protocolTimeout) {
      clearTimeout(this._protocolTimeout);
      this._protocolTimeout = undefined;
    }

    this._protocol = protocol;
  }
}
