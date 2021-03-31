import { FeatureCollection } from 'geojson';
import { UpdateStream } from './meiosis';
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
}
