import { Controller, Get, Param } from '@nestjs/common';

import { AppService } from './app.service';

@Controller({
  path: 'sessions',
})
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getSessions() {
    return (await this.appService.getSessions()) || {};
  }

  @Get('/:sessionId/:lastEventIndex')
  async getActiveSessionEvents(
    @Param('sessionId') sessionId: string,
    @Param('lastEventIndex') lastEventIndex: number
  ) {
    return await this.appService.getActiveSessionEvents(
      sessionId,
      lastEventIndex
    );
  }
}
