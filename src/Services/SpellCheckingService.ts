import { IslaMessage } from "../Classes/interfaces/IslaMessage";
import SpellChecker from "spellchecker";
import { BaseService } from "./BaseService";
import { PrismaService } from "./PrismaService";

export class SpellCheckingService implements BaseService {
  private spellcheckedIds: string[] = [];

  constructor(private readonly prisma: PrismaService) {}

  async start(): Promise<void> {
    const users = await this.prisma.spellCheckedUser.findMany({});
    users.forEach((user) => this.spellcheckedIds.push(user.id));
  }

  public async registerAccount(id: string) {
    await this.prisma.spellCheckedUser.create({
      data: {
        id,
      },
    });

    if (!this.spellcheckedIds.includes(id)) this.spellcheckedIds.push(id);
  }

  public async unregisterAccount(id: string) {
    await this.prisma.spellCheckedUser.delete({
      where: {
        id,
      },
    });

    this.spellcheckedIds = this.spellcheckedIds.filter((i) => i !== id);
  }

  async onMessage(message: IslaMessage): Promise<void> {
    if (!this.spellcheckedIds.includes(message.author.id))
      return console.warn(message.author.id);

    const misspelled = await SpellChecker.checkSpellingAsync(message.content);
    if (misspelled.length === 0) return;

    const reply = `Hiiiiiiiiii, it seems like you misspelled ${
      misspelled.length
    } word${misspelled.length === 1 ? "" : "s"} UwU. Pwease fix them :3`;

    message.reply(reply, { platformNativeReply: true });
  }
}
