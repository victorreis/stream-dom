import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DomStreamGateway } from './dom-stream/dom-stream.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, DomStreamGateway],
})
export class AppModule {}
