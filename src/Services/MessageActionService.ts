import { BaseService } from "./BaseService";
import { PrismaService } from "./PrismaService";
import { IslaMessage } from "src/Classes/interfaces/IslaMessage";

export class MessageActionService implements BaseService {
  constructor(private readonly prisma: PrismaService) {}

  public async onMessage(message: IslaMessage): Promise<void> {
    const actions = await this.prisma.messageAction.findMany({
      where: {
        channel: message.channel.id,
        frontend: message.channel.frontend.constructor.name,
      },
    });

    for (const action of actions) {
      try {
        const actionPromise = eval(`(async () => {
          ${action.script}
          })()`);

        await actionPromise;
      } catch (e) {
        message.reply(`Failed to execute message action: ${e}`);
      }
    }
  }
}
