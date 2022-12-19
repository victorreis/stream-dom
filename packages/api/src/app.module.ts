import { CacheModule, Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DomStreamGateway } from './dom-stream/dom-stream.gateway';

@Module({
  imports: [CacheModule.register({ isGlobal: true })],
  controllers: [AppController],
  providers: [AppService, DomStreamGateway],
})
export class AppModule {}
