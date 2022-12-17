import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

@Controller({
  path: 'sessions',
})
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getSessions() {
    return await this.appService.getSessions();
  }
}
