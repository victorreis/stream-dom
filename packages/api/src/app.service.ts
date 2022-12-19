import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { SessionsCache } from './models/Session.types';
import { eventWithTime } from '@rrweb/types';

@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getSessions(): Promise<SessionsCache | undefined> {
    return await this.cacheManager.get('sessions');
  }

  async getActiveSessionEvents(sessionId: string, lastEventIndex: number) {
    const sessions: SessionsCache | undefined = await this.cacheManager.get(
      'sessions'
    );
    if (
      sessions &&
      sessions.activeSessionIds[sessionId] &&
      sessions.sessions[sessionId]
    ) {
      return (sessions.sessions[sessionId] as eventWithTime[]).slice(
        lastEventIndex
      );
    }
    return [];
  }
}
