import Command from "eris-boreas/lib/src/conversation/Command";
import Conversation from "eris-boreas/lib/src/conversation/Conversation";
import Isla from "src/Classes/Isla";
import TimeParser from "../Classes/Utils/TimeParser";

export default class RemindmeCommand implements Command {
  public aliases = ["remindme", "remind"];
  public description = "Reminds you of something in the future";
  public usage = "remindme <time> <text>";

  public async run(
    conversation: Conversation,
    args: string[]
  ): Promise<string> {
    const time = new TimeParser(args.join(" "));

    if (!time.time) {
      throw new Error("E-Error, I couldn't figure out the time");
    }

    setTimeout(async () => {
      const text = `Here's your reminder from ${time.matchedText} ago "${time.textWithoutTime}"`;
      const transformedText = await (
        conversation.eris as Isla
      ).moodManager.transformMessage(text);
      await (conversation.eris as Isla).broadcast(transformedText);
    }, time.time * 1000);
    return `I'll remind you about "${time.textWithoutTime}" in ${time.matchedText}`;
  }
}
