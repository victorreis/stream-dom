import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class DomStreamGateway {
  @WebSocketServer()
  server!: Server;

  @SubscribeMessage('send_dom')
  async sendDom(@MessageBody() data: Object[]) {
    this.server.sockets.emit('receive_message', data);
  }

  @SubscribeMessage('disconnect')
  async disconnect(@MessageBody() sessionId: string) {
    console.log('disconected' + sessionId);
  }
}
