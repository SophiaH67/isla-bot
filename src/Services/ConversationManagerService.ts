import Conversation from "../Classes/Utils/Conversation";
import { IslaMessage } from "../Classes/interfaces/IslaMessage";
import { BaseService } from "./BaseService";

export default class ConversationManagerService extends BaseService {
  public conversations: { [key: string]: Conversation } = {};

  public addToOrNewConversation(message: IslaMessage): Conversation {
    const conversation = this.getOrCreateConversation(message);
    conversation.addMessage(message);
    return conversation;
  }

  public getOrCreateConversation(message: IslaMessage): Conversation {
    const conversation = this.conversations[message.replyTo?.id || ""];
    if (conversation && conversation.isWaitingForReply()) {
      return conversation;
    }

    return (this.conversations[message.id] = new Conversation(message));
  }

  async onMessage(message: IslaMessage): Promise<void> {
    const conversation = this.addToOrNewConversation(message);
    if (!conversation.isWaitingForReply()) {
      await conversation.executeDirectives();
    }
  }
}
