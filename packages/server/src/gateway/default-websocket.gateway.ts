import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { FeatureCollection, Feature } from 'geojson';
import { uuid4 } from '../../../shared/src/utils/index';
import { Server, Socket } from 'socket.io';

export interface IGroup {
  features: FeatureCollection;
  callsigns: Array<string>;
  owner: string;
}

export interface IReturnGroup {
  id: string;
  callsigns: Array<string>;
  owner: string;
}

export interface IGroupsInit {
  callsign: string;
}

export interface IGroupCreate {
  callsign: string;
  group: FeatureCollection;
}

export interface IGroupUpdate {
  callsign: string;
  group: FeatureCollection;
  id: string;
}

export interface IGroupDelete {
  callsign: string;
  id: string;
}

export interface IMessage {
  id: string;
  callsign: string;
  message: string;
}

@WebSocketGateway()
export class DefaultWebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private clients: number = 0;
  private groups: Map<string, IGroup> = new Map<string, IGroup>();
  private callsignToSocketId: Map<string, string> = new Map<string, string>();

  /** Handlers */
  async handleConnection(client: Socket) {
    this.clients++;
    console.log('Connected: ' + client.id + ' Client count: ' + this.clients);
  }

  async handleDisconnect(client: Socket) {
    this.clients--;
    console.log('Disconnected: ' + client.id + ' Client count: ' + this.clients);
  }

  @SubscribeMessage('client-init')
  handleClientInit(client: Socket, data: IGroupsInit): string {
    this.callsignToSocketId.set(data.callsign, client.id);

    return this.getGroupIdsForCallsign(data.callsign);
  }

  @SubscribeMessage('client-create')
  handleClientCreate(client: Socket, data: IGroupCreate): string {
    this.setGroupForId({ id: uuid4(), callsign: data.callsign, group: data.group });

    return this.getGroupIdsForCallsign(data.callsign);
  }

  @SubscribeMessage('client-update')
  handleClientUpdate(client: Socket, data: IGroupUpdate): string {
    this.setGroupForId(data);

    return this.getGroupIdsForCallsign(data.callsign);
  }

  @SubscribeMessage('client-delete')
  handleClientDelete(client: Socket, data: IGroupDelete): string {
    this.groups.delete(data.id);

    return this.getGroupIdsForCallsign(data.callsign);
  }

  @SubscribeMessage('client-message')
  handleMessage(client: Socket, data: IMessage): string {
    const group = this.groups.get(data.id);

    group.callsigns.forEach((callsign: string) => {
      this.server
        .to(this.callsignToSocketId.get(callsign))
        .emit('server-message', JSON.stringify({ message: data.message, id: data.id, sender: data.callsign }));
    });
    if (!group.callsigns.includes(group.owner)) {
      this.server
        .to(this.callsignToSocketId.get(group.owner))
        .emit('server-message', JSON.stringify({ message: data.message, id: data.id, sender: data.callsign }));
    }

    return data.message;
  }

  /** Helper Funcs */
  getGroupIdsForCallsign(callsign: string): string {
    let returnArray: Array<IReturnGroup> = new Array<IReturnGroup>();

    this.groups.forEach((group: IGroup, uuid: string) => {
      if (group.owner == callsign || group.callsigns.includes(callsign)) {
        returnArray.push({ id: uuid, callsigns: group.callsigns, owner: group.owner });
      }
    });

    return JSON.stringify(returnArray);
  }

  setGroupForId(update: IGroupUpdate) {
    const featureCollection = update.group as FeatureCollection;

    const callsigns = featureCollection.features.map((feature: Feature) => {
      return feature.properties.callsign;
    });

    this.groups.set(update.id, { features: featureCollection, callsigns: callsigns, owner: update.callsign });
  }
}
