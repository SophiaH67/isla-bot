import LoggingService from "../../Services/LoggingService";
import Conversation from "./Conversation";

const pilots = ["@marnix:roboco.dev", "cli-user"];

export function PilotGuard(
  _target: any,
  _propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const original = descriptor.value;

  descriptor.value = function (conversation: Conversation, args: string[]) {
    const uid = conversation.reference.author.id;

    if (!pilots.includes(uid)) {
      const logger = conversation.isla
        .getService(LoggingService)
        .getLogger(PilotGuard.name);
      logger.debug(`User "${uid}" tried to use a pilot-only command`);
      return "";
    }
    return original.apply(this, [conversation, args]);
  };
}

const copilots = ["@fredi_68:matrix.org"];

export function CopilotGuard(
  _target: any,
  _propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const original = descriptor.value;

  descriptor.value = function (conversation: Conversation, args: string[]) {
    const uid = conversation.reference.author.id;

    if (!copilots.includes(uid)) {
      const logger = conversation.isla
        .getService(LoggingService)
        .getLogger(CopilotGuard.name);
      logger.debug(`User "${uid}" tried to use a copilot-only command`);

      if (pilots.includes(uid)) {
        const t = "I'm afraid I can't let you do that.";
        logger.warn(t);
        return t;
      }

      return "";
    }
    return original.apply(this, [conversation, args]);
  };
}
