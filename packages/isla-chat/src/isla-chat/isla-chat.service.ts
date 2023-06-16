import { Message } from '@marnixah/isla-proto/dist/islachat';
import { Injectable } from '@nestjs/common';
import { DirectiveHandlerService } from 'src/directive-handler/directive-handler.service';
import Conversation from './Conversation';

@Injectable()
export class IslaChatService {
  private readonly commands = [];

  constructor(
    private readonly directiveHandlerService: DirectiveHandlerService,
  ) {}

  public async handleConversation(conversation: Conversation): Promise<void> {
    conversation.eventEmitter.on('message', (message: Message) => {
      this.handleMessage(message, conversation);
    });
  }

  private async handleMessage(message: Message, conversation: Conversation) {
    // Execute directives if message isn't ours
    if (message.author.isIsla) return;

    const unfilteredAnswers = await Promise.all(
      conversation.directives.map((directive) =>
        this.directiveHandlerService
          .handleDirective(conversation, directive)
          .then((answer) => this.transformMessage(answer)),
      ),
    );
    // Remove undefined answers
    let answers = unfilteredAnswers.filter(Boolean) as string[];
    // Remove empty answers
    answers = answers.filter((answer) => answer.trim());

    for (let i = 0; i < answers.length; i++) {
      await conversation.write(answers[i], true);
    }
  }

  private transformMessage(message: string) {
    return message;
  }
}
