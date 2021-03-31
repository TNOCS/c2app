import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';

@WebSocketGateway()
export class DefaultWebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server;
  clients: number = 0;

  // A client has connected
  async handleConnection(socket) {
    this.clients++;
    console.log(socket.id + ' Client count: ' + this.clients);
  }

  // A client has disconnected
  async handleDisconnect() {
    this.clients--;
    console.log('Disconnect, client count: ' + this.clients);
  }

  @SubscribeMessage('client-update')
  handleEvent(@MessageBody() data: string, @ConnectedSocket() socket): string {
    console.log(socket.id);
    return data;
  }
}
