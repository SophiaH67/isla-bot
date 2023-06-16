import { Module } from '@nestjs/common';
import { DirectiveHandlerService } from './directive-handler.service';

@Module({
  providers: [DirectiveHandlerService],
  exports: [DirectiveHandlerService],
})
export class DirectiveHandlerModule {}
