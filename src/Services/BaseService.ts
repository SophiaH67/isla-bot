import { IslaMessage } from "../Classes/interfaces/IslaMessage";

export interface BaseService {
  onMessage?(message: IslaMessage): Promise<void>;
  onMessageUpdate?(message: IslaMessage): Promise<void>;
  start?(): Promise<void>;

  // Make typescript not complain that there is nothing in common
  // between the services; I HATE THIS
  [key: string]: any;
}
