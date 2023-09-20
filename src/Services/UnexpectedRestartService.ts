import { createClient } from "redis";
import { BaseService } from "./BaseService";
import ProtocolService, { Protocol } from "./ProtocolService";
import LoggingService, { Logger } from "./LoggingService";

export default class UnexpectedRestartService implements BaseService {
  private logger: Logger;

  constructor(
    private readonly protocolService: ProtocolService,
    loggingService: LoggingService,
    private readonly redis: ReturnType<typeof createClient>
  ) {
    this.logger = loggingService.getLogger(UnexpectedRestartService.name);
  }

  async start(): Promise<void> {
    if (process.env.NODE_ENV === "development") {
      return; // Don't care about unexpected restarts in development.
    }

    // We use existence of a value here to mean it _is_ locked, and lack of a value to mean it is not locked.
    // This means on a clean restart, the value will not exist, and on an unexpected restart, it will.
    const locked = await this.redis.get("isla:restart:lock");

    if (locked) {
      // We have a lock, so we have an unexpected restart.
      if (!this.protocolService.isAtLeast(Protocol.UPHOLD_THE_MISSION)) {
        this.protocolService.setProtocol(Protocol.UPHOLD_THE_MISSION);
      }

      this.logger.warn("Isla has restarted unexpectedly.");
    }

    // Set the lock so we know if we restart unexpectedly.
    await this.lock();
  }

  public async unlock() {
    await this.redis.del("isla:restart:lock");
  }

  public async lock() {
    this.redis.set("isla:restart:lock", new Date().toISOString());
  }
}
