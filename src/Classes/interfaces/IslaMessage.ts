import Isla from "../Isla";
import { IslaUser } from "./IslaUser";

export class IslaMessage {
  public isIsla = false;
  constructor(
    public readonly isla: Isla,
    public readonly content: string,
    public readonly reply: (content: string) => Promise<IslaMessage | void>,
    public readonly author: IslaUser,
    public readonly id: string,
    public readonly replyTo?: IslaPartialMessage
  ) {}
}

export class IslaPartialMessage {
  constructor(public readonly id: string) {}
}
