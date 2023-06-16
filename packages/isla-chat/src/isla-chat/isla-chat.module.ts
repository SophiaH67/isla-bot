import { Module } from '@nestjs/common';
import { IslaChatService } from './isla-chat.service';
import { IslaChatController } from './isla-chat.controller';
import { DirectiveHandlerModule } from 'src/directive-handler/directive-handler.module';

@Module({
  imports: [DirectiveHandlerModule],
  providers: [IslaChatService],
  controllers: [IslaChatController],
})
export class IslaChatModule {}
