import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { FeatureCollection } from 'geojson';

export interface IGroup {
  data: FeatureCollection;
  id: string;
}

@WebSocketGateway()
export class DefaultWebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server;
  clients: number = 0;
  groups: {[key: string]: IGroup[]} = {};

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
  handleEvent(@MessageBody() data: IGroup[], @ConnectedSocket() socket): string {
    this.groups[socket.id] = data;
    return "success";
  }
}
