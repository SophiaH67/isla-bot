import { ConversationReply, Message } from '@marnixah/isla-proto/dist/islachat';
import { Observable, Subscriber } from 'rxjs';
import { EventEmitter } from 'events';
import { DirectiveHandlerService } from 'src/directive-handler/directive-handler.service';

export default class Conversation {
  public messages: Message[] = [];
  public directives: string[] = [];
  public target: string | null = null; // Intended user
  private outgoingSubscriber: Subscriber<ConversationReply> | null = null;
  public outgoing: Observable<ConversationReply>;
  public eventEmitter = new EventEmitter();

  constructor(
    private incoming: Observable<Message>,
    public readonly directiveHandlerService: DirectiveHandlerService,
  ) {
    this.outgoing = new Observable((subscriber) => {
      this.outgoingSubscriber = subscriber;
    });

    this.incoming.subscribe((message) => {
      this.addMessage(message);
      this.eventEmitter.emit('message', message);
    });
  }

  get reference() {
    return this.messages.at(-1);
  }

  public isWaitingForReply() {
    return (this.directives.at(-1) || '').toLowerCase() === 'also';
  }

  public addMessage(message: Message) {
    if (this.isWaitingForReply()) this.directives.pop(); // Remove 'Also' directive

    this.messages.push(message);
    // Parse the message content for directives
    // Split on double newlines as basic message splitting
    const parts = message.content.split(/\n\n/g);
    // Check if first directive mentions someone
    const discordMentionRegex = /<@!*&*[0-9]+>/;
    const mentionDirective = parts[0].match(discordMentionRegex);
    if (mentionDirective) {
      this.target = mentionDirective[0].replace(/[<@!&>]/g, '');
      this.directives.push(parts[0].replace(discordMentionRegex, ''));
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

  public write(content: string, last = false) {
    let replyMessage = this.messages
      .reverse()
      .find((message) => message.author.isIsla);

    if (!replyMessage) replyMessage = this.reference;

    const message: ConversationReply = {
      content,
      last,
      replyToId: this.messages.at(-1).id,
    };

    this.outgoingSubscriber.next(message);
  }
}
