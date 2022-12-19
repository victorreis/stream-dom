import { CACHE_MANAGER, Inject } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Cache } from 'cache-manager';
import { Server, Socket } from 'socket.io';
import { DataMessageBody, SessionsCache } from '../models/Session.types';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class DomStreamGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  getSessionIdFromSocket(socket: Socket): string {
    return socket.handshake.headers['sessionid'] as string;
  }

  handleConnection(socket: Socket) {
    const sessionId = this.getSessionIdFromSocket(socket);
    console.log(`'${sessionId}' is connected.`);
  }

  @SubscribeMessage('send_dom')
  async sendDom(
    @MessageBody() data: DataMessageBody,
    @ConnectedSocket() socket: Socket
  ) {
    const sessionId = this.getSessionIdFromSocket(socket);
    console.log(
      `[${new Date()
        .toString()
        .substring(16, 24)}] EVENT: send_dom -> ${sessionId}`
    );

    const { activeSessionIds, sessions }: SessionsCache =
      (await this.cacheManager.get('sessions')) || {
        activeSessionIds: {},
        sessions: {},
      };

    await this.cacheManager.set('sessions', {
      activeSessionIds: { ...activeSessionIds, [data.sessionId]: true },
      sessions: {
        ...sessions,
        [data.sessionId]: data.events,
      },
    });
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    const sessionId = this.getSessionIdFromSocket(socket);
    console.log(`'${sessionId}' was disconnected.`);

    const sessionsState: SessionsCache | undefined =
      await this.cacheManager.get('sessions');
    const { activeSessionIds, sessions } = sessionsState || {};

    if (activeSessionIds) {
      delete activeSessionIds[sessionId];
      this.cacheManager.set('sessions', {
        activeSessionIds,
        sessions,
      });
    }
  }
}
