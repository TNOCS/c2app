import { FeatureCollection } from 'geojson';
import { IAppModel, UpdateStream } from './meiosis';
import io from 'socket.io-client';

export class Socket {
  private socket: SocketIOClient.Socket;
  private update: boolean = false;
  private clientId: string | null = '';

  constructor(us: UpdateStream) {
    this.socket = io(process.env.SERVER || 'http://localhost:3000');
    this.socket.on('connect', () => {
      if(!window.localStorage.getItem('socketId')) window.localStorage.setItem('socketId', this.socket.id);
      this.clientId = window.localStorage.getItem('socketId');

      this.socket.emit('groups', {clientId: this.clientId}, (result: string) => {
        const data = JSON.parse(result);
        us({ app: { groups: () => data}});
      })
    })

    this.socket.on('positions', (data: FeatureCollection) => {
      us({ app: { positionSource: data } });
    });
    this.socket.on('chemical-hazard', (data: FeatureCollection) => {
      us({ app: { chemicalHazardSource: data } });
    });
  }
  queueServerUpdate() {
    this.update = true;
  }

  updateServer(s: IAppModel) {
    if (this.update) this.socket.emit('client-update', {clientId: this.clientId, groups: s.app.groups}, (result: String) => console.log(result));
    this.update = false;
  }
}
