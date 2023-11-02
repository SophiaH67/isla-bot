import { UserLevel } from "@prisma/client";
import LoggingService from "../../Services/LoggingService";
import Conversation from "./Conversation";
import { UserService } from "../../Services/UserService";

export function LevelGuard(requiredLevel: UserLevel) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const original = descriptor.value;

    descriptor.value = async function (
      conversation: Conversation,
      args: string[]
    ) {
      const uid = conversation.reference.author.id;

      const userService = conversation.isla.getService(UserService);

      const user = await userService.getUser({
        userId: uid,
        frontend: conversation.reference.channel.frontend.constructor.name,
      });

      if (user?.level !== requiredLevel) {
        const logger = conversation.isla
          .getService(LoggingService)
          .getLogger(LevelGuard.name);
        logger.debug(
          `User "${uid}" tried to use a ${requiredLevel}-only command`
        );

        return "";
      }

      return original.apply(this, [conversation, args]);
    };
  };
}

export function PilotGuard(
  _target: any,
  _propertyKey: string,
  descriptor: PropertyDescriptor
) {
  return LevelGuard(UserLevel.PILOT)(_target, _propertyKey, descriptor);
}
