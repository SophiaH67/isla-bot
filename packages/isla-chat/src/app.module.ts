import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IslaChatModule } from './isla-chat/isla-chat.module';
import { DirectiveHandlerModule } from './directive-handler/directive-handler.module';

@Module({
  imports: [IslaChatModule, DirectiveHandlerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
