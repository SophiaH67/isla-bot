import LoggingService from "../../Services/LoggingService";
import Conversation from "./Conversation";

const allowedUsers = [
  "178210163369574401",
  "231446107794702336",
  "@marnix:roboco.dev",
  "cli-user",
];

export function AdminGuard(
  _target: any,
  _propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const original = descriptor.value;

  descriptor.value = function (conversation: Conversation, args: string[]) {
    const uid = conversation.reference.author.id;

    if (!allowedUsers.includes(uid)) {
      const logger = conversation.isla
        .getService(LoggingService)
        .getLogger(AdminGuard.name);
      logger.debug(`User "${uid}" tried to use an admin command`);
      return "";
    }
    return original.apply(this, [conversation, args]);
  };
}
