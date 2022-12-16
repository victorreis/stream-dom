import { CACHE_MANAGER, Inject } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Cache } from 'cache-manager';
import { Server } from 'socket.io';

interface DataMessageBody {
  sessionId: string;
  events: Object[];
}

interface SessionsCache {
  activeSessionIds: Record<string, boolean>;
  sessions: Record<string, unknown>;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class DomStreamGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  sessionId!: string;

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  @SubscribeMessage('send_dom')
  async sendDom(@MessageBody() data: DataMessageBody) {
    // console.log('send_dom', data.sessionId);
    this.sessionId = data.sessionId;
    const { activeSessionIds, sessions }: SessionsCache =
      (await this.cacheManager.get('sessions')) || {
        activeSessionIds: {},
        sessions: {},
      };

    if (
      !Object.keys(activeSessionIds).find(
        (session) => session === data.sessionId
      )
    ) {
      console.log(`'${this.sessionId}' is connected.`);
    }

    await this.cacheManager.set('sessions', {
      activeSessionIds: { ...activeSessionIds, [data.sessionId]: true },
      sessions: {
        ...sessions,
        [data.sessionId]: [
          ...((sessions[data.sessionId] as unknown[]) || []),
          data.events[0],
        ],
      },
    });
    // console.log(await this.cacheManager.get('sessions'));
    return data;
  }

  async handleDisconnect() {
    console.log(`'${this.sessionId}' was disconnected.`);
    const sessionsState: SessionsCache | undefined =
      await this.cacheManager.get('sessions');

    if (sessionsState?.activeSessionIds) {
      this.cacheManager.set('sessions', {
        activeSessionIds: [
          ...Object.keys(sessionsState.activeSessionIds).filter(
            (session) => session !== this.sessionId
          ),
        ],
        sessions: sessionsState.sessions,
      });
    }
  }
}
