import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IslaChatModule } from './isla-chat/isla-chat.module';
import { DirectiveHandlerModule } from './directive-handler/directive-handler.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [IslaChatModule, DirectiveHandlerModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
