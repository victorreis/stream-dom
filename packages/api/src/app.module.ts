import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DomStreamGateway } from './dom-stream/dom-stream.gateway';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    CacheModule.register({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    DomStreamGateway,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
