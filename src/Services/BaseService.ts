import { IslaMessage } from "../Classes/interfaces/IslaMessage";

export type Events = {
  message: [IslaMessage]; // message
  messageUpdate: [IslaMessage]; // message
  start: []; // void
};

export type EventListeners = {
  [K in keyof Events as `on${Capitalize<string & K>}`]: (
    ...args: Events[K]
  ) => Promise<void> | void;
};

export interface BaseService extends Partial<EventListeners> {
  // Make typescript not complain that there is nothing in common
  // between the services; I HATE THIS
  [key: string]: any;
}
