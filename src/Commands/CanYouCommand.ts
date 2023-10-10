import Conversation from "../Classes/Utils/Conversation";
import Command from "../Classes/Utils/Command";
import { SleepBypass } from "../Classes/Utils/SleepBypass";

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
    "set",
    "to",
    "change",
  ];
  public description = "Replaces words to find a matching command";
  public usage = "can you <command>";

  @SleepBypass
  public async run(
    conversation: Conversation,
    args: string[]
  ): Promise<string | undefined> {
    // Create a new message with the first argument removed
    // while putting quotes around each element
    const newMessage = args.slice(1).join(" ");

    return await conversation.isla.directiveHandler.handleDirective(
      conversation,
      newMessage
    );
  }
}
