import Command from "eris-boreas/lib/src/conversation/Command";
import Conversation from "eris-boreas/lib/src/conversation/Conversation";

export default class CanYouCommand implements Command {
  public name = "can you";
  public aliases: string[] = [
    "can",
    "could",
    "you",
    "isla",
    "please",
    "tell",
    "me",
    "about",
    "the",
    "give",
    "<@!952582449437765632>",
    "just",
  ];
  public description = "Replaces words to find a matching command";
  public usage = "can you <command>";

  public async run(
    conversation: Conversation,
    args: string[]
  ): Promise<string | undefined> {
    // Create a new message with the first argument removed
    // while putting quotes around each element
    const newMessage = args.slice(1).join(" ");

    return await conversation.eris.directiveHandler.handleDirective(
      conversation,
      newMessage
    );
  }
}
