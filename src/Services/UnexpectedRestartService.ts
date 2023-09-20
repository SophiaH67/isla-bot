import { createClient } from "redis";
import { BaseService } from "./BaseService";
import Isla from "src/Classes/Isla";
import ProtocolService, { Protocol } from "./ProtocolService";
import LoggingService, { Logger } from "./LoggingService";

export default class UnexpectedRestartService extends BaseService {
  private redis!: ReturnType<typeof createClient>;
  private logger!: Logger;
  private protocolService!: ProtocolService;

  async onReady(isla: Isla): Promise<void> {
    this.redis = isla.redis;
    this.protocolService = isla.getService(ProtocolService);
    this.logger = isla
      .getService(LoggingService)
      .getLogger(UnexpectedRestartService.name);

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
