import { IslaMessage } from "../Classes/interfaces/IslaMessage";
import { BaseService } from "./BaseService";
import { PrismaService } from "./PrismaService";
import { UserService } from "./UserService";

export class MessageLoggerService implements BaseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService
  ) {}

  async onMessage(message: IslaMessage): Promise<void> {
    return this.handleMessage(message);
  }

  async onMessageUpdate(message: IslaMessage): Promise<void> {
    return this.handleMessage(message);
  }

  private async handleMessage(message: IslaMessage): Promise<void> {
    const author = await this.userService.getUser(message);

    await this.prisma.loggedMessage.upsert({
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
        author: {
          connect: {
            id: author.id,
          },
        },
      },
    });
  }
}
