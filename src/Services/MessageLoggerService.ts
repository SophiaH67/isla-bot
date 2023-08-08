import { IslaMessage } from "../Classes/interfaces/IslaMessage";
import Isla from "../Classes/Isla";
import { BaseService } from "./BaseService";
import { PrismaService } from "./PrismaService";

export class MessageLoggerService implements BaseService {
  private prisma!: PrismaService;
  private isla!: Isla;

  async onReady(_isla: Isla): Promise<void> {
    this.isla = _isla;
    this.prisma = this.isla.getService(PrismaService);
  }

  async onMessage(message: IslaMessage): Promise<void> {
    return this.handleMessage(message);
  }

  async onMessageUpdate(message: IslaMessage): Promise<void> {
    return this.handleMessage(message);
  }

  private async handleMessage(message: IslaMessage): Promise<void> {
    await this.prisma.message.upsert({
      where: {
        id: message.id,
        channel: message.channel.id,
        frontend: message.channel.frontend.constructor.name,
      },
      update: {
        id: message.id,
        frontend: message.channel.frontend.constructor.name,
        channel: message.channel.id,
        content: message.content,
      },
      create: {
        id: message.id,
        frontend: message.channel.frontend.constructor.name,
        channel: message.channel.id,
        content: message.content,
      },
    });
  }
}
