import Isla from "../Classes/Isla";
import { IslaMessage } from "../Classes/interfaces/IslaMessage";

export abstract class BaseService {
  onMessage?(message: IslaMessage): Promise<void>;
  onMessageUpdate?(message: IslaMessage): Promise<void>;
  onReady?(isla: Isla): Promise<void>;
}
