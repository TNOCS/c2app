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

export interface IGroupsUpdate {
  clientId: string;
  groups: IGroup[]
}

export interface IGroupsRequest{
  clientId: string;
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
  handleClientUpdate(@MessageBody() data: IGroupsUpdate): string {
    this.groups[data.clientId] = data.groups;
    return "success";
  }

  @SubscribeMessage('groups')
  handleGroups(@MessageBody() data: IGroupsRequest): string {
    return JSON.stringify(this.groups[data.clientId]);
  }
}
