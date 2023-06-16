import { Controller } from '@nestjs/common';
import {
  IslaChatControllerMethods,
  IslaChatController as ProtoIslaChatController,
  Message,
  ConversationReply,
} from '@marnixah/isla-proto/dist/islachat';
import { Observable } from 'rxjs';
import { IslaChatService } from './isla-chat.service';
import Conversation from './Conversation';
import { DirectiveHandlerService } from 'src/directive-handler/directive-handler.service';

@Controller('isla-chat')
@IslaChatControllerMethods()
export class IslaChatController implements ProtoIslaChatController {
  constructor(
    private readonly islaChatService: IslaChatService,
    private readonly directiveHandlerService: DirectiveHandlerService,
  ) {}

  conversation(request: Observable<Message>): Observable<ConversationReply> {
    const conversation = new Conversation(
      request,
      this.directiveHandlerService,
    );

    this.islaChatService.handleConversation(conversation);

    return conversation.outgoing;
  }
}
