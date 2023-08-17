import Conversation from "../Classes/Utils/Conversation";
import Command from "../Classes/Utils/Command";
import { PrismaService } from "../Services/PrismaService";
import { AdminGuard } from "../Classes/Utils/AdminGuard";

export default class MessageActionCommand implements Command {
  public name = "message-action";
  public aliases: string[] = [
    "message-actions",
    "message-action",
    "messageaction",
    "messageactions",
  ];
  public description = "CRUD for message actions";
  public usage = "message-action <add|remove|list> [args]";

  @AdminGuard
  public async run(
    conversation: Conversation,
    args: string[]
  ): Promise<string | undefined> {
    if (args.length < 2) {
      return `Usage: ${this.usage}`;
    }
    const prisma = conversation.isla.getService<PrismaService>(PrismaService);

    const action = args[1].toLowerCase();

    switch (action) {
      case "add":
        if (args.length < 4) {
          return `Usage: ${args[0]} ${args[1]} <name> <script>`;
        }

        const name = args[2];
        const script = args.slice(3).join(" ");

        await prisma.messageAction.create({
          data: {
            name,
            script,
            channel: conversation.reference.channel.id,
            frontend: conversation.reference.channel.frontend.constructor.name,
          },
        });

        return `Added message action ${name}`;
      case "remove":
        if (args.length < 3) {
          return `Usage: ${args[0]} ${args[1]} <name>`;
        }

        const nameToRemove = args[2];

        const removed = await prisma.messageAction.delete({
          where: {
            name: nameToRemove,
            channel: conversation.reference.channel.id,
            frontend: conversation.reference.channel.frontend.constructor.name,
          },
        });

        if (removed) {
          return `Removed message action ${nameToRemove}`;
        } else {
          return `Could not find message action ${nameToRemove} in this channel`;
        }
      case "list":
        const actions = await prisma.messageAction.findMany({
          where: {
            channel: conversation.reference.channel.id,
            frontend: conversation.reference.channel.frontend.constructor.name,
          },
        });

        if (actions.length === 0) {
          return "No message actions in this channel";
        }

        const names = actions.map((action) => action.name).join(", ");

        return `Message actions in this channel: ${names}`;
      default:
        return `Usage: ${this.usage}`;
    }
  }
}
