import { FeatureCollection } from 'geojson';
import { IAppModel, UpdateStream } from './meiosis';
import io from 'socket.io-client';

export class Socket {
  private socket: SocketIOClient.Socket;
  private update: boolean = false;

  constructor(us: UpdateStream) {
    this.socket = io(process.env.SERVER || 'http://localhost:3000');

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
    if (this.update) this.socket.emit('client-update', s.app.groups, (result: String) => console.log(result));
    this.update = false;
  }
}
