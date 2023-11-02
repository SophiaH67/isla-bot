import Isla from "../Isla";
import { IslaChannel } from "./IslaChannel";
import { IslaUser } from "./IslaUser";

export interface ReplyOptions {
  forceThread?: boolean;
  /// Use platform-native reply or just send a message
  platformNativeReply?: boolean;
  /// Media to send with the message, either URLs or Buffers
  media?: (string | Buffer)[];
}

export class IslaMessage {
  constructor(
    public readonly isla: Isla,
    public readonly content: string,
    public readonly reply: (
      content: string,
      replyOptions?: ReplyOptions
    ) => Promise<IslaMessage | void>,
    public readonly remove: () => Promise<void>,
    public readonly author: IslaUser,
    public readonly id: string,
    public readonly channel: IslaChannel,
    public readonly replyTo?: IslaPartialMessage
  ) {}
}

export class IslaPartialMessage {
  constructor(public readonly id: string) {}
}
