import ms from "ms";
import { BaseService } from "./BaseService";
import LoggingService, { Logger } from "./LoggingService";
import ProtocolService, { Protocol } from "./ProtocolService";

const TimeoutMap = {
  [Protocol.LINK_TO_PILOT]: ms("1m"),
  [Protocol.UPHOLD_THE_MISSION]: ms("60m"),
  [Protocol.PROTECT_THE_PILOT]: ms("9999h"), // Cannot elevate protocol, since this is the highest
};

/**
 * Service that keeps track keep alive messages sent by the pilot.
 *
 * If the pilot does not send a keep alive message within the timeout
 * period, the protocol is promoted to the next level. This is the
 * only responsibility of this service.
 */
export default class KeepAliveService implements BaseService {
  private MAX_TIMEOUT: number;
  private timeout: NodeJS.Timeout | undefined;
  private lastPing: Date;
  private logger: Logger;

  constructor(
    private readonly protocolService: ProtocolService,
    loggingService: LoggingService
  ) {
    this.logger = loggingService.getLogger(KeepAliveService.name);
    this.MAX_TIMEOUT = TimeoutMap[protocolService.getProtocol()];
    this.lastPing = new Date();
  }

  async onProtocolChange(protocol: Protocol): Promise<void> {
    const newTimeout = TimeoutMap[protocol];

    if (newTimeout === this.MAX_TIMEOUT) {
      return;
    }

    // Cancel current timeout
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    // Calculate elapsed time
    const elapsed = new Date().getTime() - this.lastPing?.getTime();
    // Calculate new timeout using new max timeout, since this is new protocol
    const newTimeoutTime = newTimeout - elapsed;

    this.MAX_TIMEOUT = newTimeout;
    this.timeout = setTimeout(this.expired.bind(this), newTimeoutTime);
  }

  async start(): Promise<void> {
    this.ping();
  }

  public ping() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(this.expired.bind(this), this.MAX_TIMEOUT);
    this.lastPing = new Date();
  }

  private expired() {
    this.logger.info("Max timeout reached");

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    switch (this.protocolService.getProtocol()) {
      case Protocol.LINK_TO_PILOT:
      case Protocol.UPHOLD_THE_MISSION:
        this.logger.info("Protocol is not 3, promoting protocol to 3");
        this.protocolService.setProtocol(Protocol.PROTECT_THE_PILOT);
        break;

      case Protocol.PROTECT_THE_PILOT:
        this.logger.warn("Protocol 3 timeout reached");
    }
  }
}
