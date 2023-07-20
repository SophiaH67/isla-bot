import Isla from "../Isla";
import { IslaMessage } from "../interfaces/IslaMessage";

export default class Conversation {
  public messages: IslaMessage[] = [];
  public directives: string[] = [];
  public target: string | null = null; // Intended user
  public reference: IslaMessage;
  public isla: Isla;

  constructor(reference: IslaMessage) {
    this.reference = reference;
    this.isla = reference.isla;
  }

  public isWaitingForReply() {
    return (
      (this.directives[this.directives.length - 1] || "").toLowerCase() ===
      "also"
    );
  }

  public addMessage(message: IslaMessage) {
    if (this.isWaitingForReply()) this.directives.pop(); // Remove 'Also' directive

    this.messages.push(message);
    // Parse the message content for directives
    // Split on double newlines as basic message splitting
    const parts = message.content.split(/\n\n/g);
    // Check if first directive mentions someone
    const discordMentionRegex = /<@!*&*[0-9]+>/;
    const mentionDirective = parts[0].match(discordMentionRegex);
    if (mentionDirective) {
      this.target = mentionDirective[0].replace(/[<@!&>]/g, "");
      this.directives.push(parts[0].replace(discordMentionRegex, ""));
      parts.shift();
    }
    // Add all other directives
    parts.forEach((part) => {
      this.directives.push(part);
    });
    // Trim and remove empty directives
    this.directives = this.directives.map((directive) => directive.trim());
    this.directives = this.directives.filter(Boolean);
  }

  public async executeDirectives() {
    const unfilteredAnswers = await Promise.all(
      this.directives.map((directive) =>
        this.isla.directiveHandler
          .handleDirective(this, directive)
          .then((answer) => this.isla.transformMessage(answer))
      )
    );
    // Remove undefined answers
    let answers = unfilteredAnswers.filter(Boolean) as string[];
    // Remove empty answers
    answers = answers.filter((answer) => answer.trim());

    for (let i = 0; i < answers.length; i++) {
      await this.write(answers[i], true);
    }
  }

  public async write(answer: string, lastChunk = false) {
    // Split messages into chunks of 2000 characters or less
    const chunks = [];
    let chunk = "";
    for (const char of answer) {
      if (chunk.length + char.length > 1950) {
        chunks.push(chunk);
        chunk = "";
      }
      chunk += char;
    }
    if (chunk.length) chunks.push(chunk);

    for (let i = 0; i < chunks.length; i++) {
      const lastChunkChunk = i === chunks.length - 1;
      await this.writeRaw(chunks[i], lastChunkChunk && lastChunk);
    }
  }

  public async writeRaw(chunk: string, last = false) {
    let replyMessage = this.messages.reverse().find((message) => {
      return message.isIsla;
    });

    if (!replyMessage) replyMessage = this.reference;

    const msg = await replyMessage.reply(chunk + (!last ? "\n\nalso" : ""));
    return msg;
  }
}
