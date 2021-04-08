import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { FeatureCollection } from 'geojson';
import { Server, Socket } from 'socket.io';

export interface IGroup {
  data: FeatureCollection;
  id: string;
}

export interface IGroupsUpdate {
  clientId: string;
  groups: IGroup[];
}

export interface IGroupsRequest {
  clientId: string;
}

@WebSocketGateway()
export class DefaultWebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  clients: number = 0;
  groups: { [key: string]: IGroup[] } = {};

  // A client has connected
  async handleConnection(client: Socket) {
    this.clients++;
    console.log('Connected: ' + client.id + ' Client count: ' + this.clients);
  }

  // A client has disconnected
  async handleDisconnect(client: Socket) {
    this.clients--;
    console.log('Disconnected: ' + client.id + ' Client count: ' + this.clients);
  }

  @SubscribeMessage('client-update')
  handleClientUpdate(client: Socket, data: IGroupsUpdate): string {
    this.groups[data.clientId] = data.groups;
    console.log(this.groups);
    return 'success';
  }

  @SubscribeMessage('groups')
  handleGroups(client: Socket, data: IGroupsRequest): string {
    return JSON.stringify(this.groups[data.clientId]);
  }
}
