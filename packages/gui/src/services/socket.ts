import { FeatureCollection } from 'geojson';
import { IAppModel, UpdateStream } from './meiosis';
import io from 'socket.io-client';

export class Socket {
  private socket: SocketIOClient.Socket;

  constructor(us: UpdateStream) {
    this.socket = io(process.env.SERVER || 'http://localhost:3000');

    this.socket.on('positions', (data: FeatureCollection) => {
      us({ app: { positionSource: data } });
    });
    this.socket.on('chemical-hazard', (data: FeatureCollection) => {
      us({ app: { chemicalHazardSource: data } });
    });
  }
  updateServer(s: IAppModel) {
    this.socket.emit('client-update', s.app.groups, (result: String) => console.log(result))
  }
}
