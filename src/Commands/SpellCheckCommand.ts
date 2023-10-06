import Conversation from "../Classes/Utils/Conversation";
import Command from "../Classes/Utils/Command";
import { AdminGuard } from "../Classes/Utils/AdminGuard";
import { SpellCheckingService } from "../Services/SpellCheckingService";

export default class SpellCheckCommand implements Command {
  public name = "spellcheck";
  public aliases: string[] = ["spellcheck", "spellchecker"];
  public description = "CRUD for spell checker";
  public usage = "message-action <add|remove> [args]";

  @AdminGuard
  public async run(
    conversation: Conversation,
    args: string[]
  ): Promise<string | undefined> {
    if (args.length < 2) {
      return `Usage: ${this.usage}`;
    }
    const spellCheckingService =
      conversation.isla.getService(SpellCheckingService);

    const action = args[1].toLowerCase();

    switch (action) {
      case "add":
        if (args.length < 3) {
          return `Usage: ${args[0]} ${args[1]} <user id>`;
        }

        const id = args[2];

        return await spellCheckingService
          .registerAccount(id)
          .catch((e) => {
            return `Failed to register account ${id} to be spell checked: ${e.message}`;
          })
          .then(() => {
            return `Registered account ${id} to be spell checked`;
          });

      case "remove":
        if (args.length < 3) {
          return `Usage: ${args[0]} ${args[1]} <user id>`;
        }

        const idToRemove = args[2];

        return await spellCheckingService
          .unregisterAccount(idToRemove)
          .catch((e) => {
            return `Failed to unregister account ${idToRemove} to be spell checked: ${e.message}`;
          })
          .then(() => {
            return `Unregistered account ${idToRemove} to be spell checked`;
          });

      default:
        return `Usage: ${this.usage}`;
    }
  }
}
