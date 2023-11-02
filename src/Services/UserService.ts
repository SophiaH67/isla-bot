import { IslaMessage } from "../Classes/interfaces/IslaMessage";
import { BaseService } from "./BaseService";
import { PrismaService } from "./PrismaService";
import { User, UserLevel } from "@prisma/client";

export class UserService implements BaseService {
  constructor(private prisma: PrismaService) {}

  public async getUser(data: {
    userId: string;
    frontend: string;
  }): Promise<User | null>;
  public async getUser(message: IslaMessage): Promise<User>;
  public async getUser(
    data: { userId: string; frontend: string } | IslaMessage
  ): Promise<User | null> {
    if (data instanceof IslaMessage) {
      const user = await this.prisma.user.upsert({
        where: {
          id: data.author.id,
        },
        update: {
          name: data.author.name,
        },
        create: {
          id: data.author.id,
          frontend: data.channel.frontend.constructor.name,
          name: data.author.name,
        },
      });

      return user;
    }

    return this.prisma.user.findUnique({
      where: {
        id: data.userId,
        frontend: data.frontend,
      },
    });
  }

  public async setLevel(
    userId: string,
    frontend: string,
    role: UserLevel
  ): Promise<void> {
    if (role === UserLevel.PILOT) {
      throw new Error("There can only be one pilot");
    }

    await this.prisma.user.update({
      where: {
        id: userId,
        frontend,
      },
      data: {
        level: role,
      },
    });
  }

  private async getPilot(): Promise<User> {
    const pilot = await this.prisma.user.findFirst({
      where: {
        level: UserLevel.PILOT,
      },
    });

    if (!pilot) {
      throw new Error("No pilot found");
    }

    return pilot;
  }

  public async transferPilotship(newPilotId: string, frontend: string) {
    const newPilot = await this.getUser({
      userId: newPilotId,
      frontend,
    });

    if (!newPilot) {
      throw new Error("New pilot not found");
    }

    const currentPilot = await this.getPilot();

    await this.prisma.user.update({
      where: {
        id: currentPilot.id,
      },
      data: {
        level: UserLevel.COPILOT,
      },
    });

    await this.prisma.user.update({
      where: {
        id: newPilot.id,
      },
      data: {
        level: UserLevel.PILOT,
      },
    });

    return newPilot;
  }
}
