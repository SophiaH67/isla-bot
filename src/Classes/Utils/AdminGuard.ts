import Conversation from "./Conversation";

const allowedUsers = [
  "178210163369574401",
  "231446107794702336",
  "@marnix:roboco.dev",
];

export function AdminGuard(
  _target: any,
  _propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const original = descriptor.value;

  descriptor.value = function (conversation: Conversation, args: string[]) {
    if (!allowedUsers.includes(conversation.reference.author.id)) {
      return "You are not allowed to use this command";
    }
    return original.apply(this, [conversation, args]);
  };
}
