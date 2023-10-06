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
    if (!this.spellcheckedIds.includes(message.author.id)) return;

    // Remove any mentions
    let content = message.content.replace(/<[^>]*>?/gm, "");
    // Also in format of format username#1234
    content = content.replace(/((.+?)#\d{1,4})/gm, "");
    // Remove any links
    content = content.replace(/https?:\/\/[^ ]+/gm, "");
    // Finally, remove double spaces
    content = content.replace(/ +(?= )/g, "");

    const misspelled = await SpellChecker.checkSpellingAsync(content);
    if (misspelled.length === 0) return;

    const reply = `Hiiiiiiiiii, it seems like you misspelled ${
      misspelled.length
    } word${misspelled.length === 1 ? "" : "s"} UwU. Pwease fix them :3`;

    message.reply(reply, { platformNativeReply: true });
  }
}
