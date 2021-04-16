import { FeatureCollection } from 'geojson';
import { IAppModel, UpdateStream, IGroup, IMessage } from './meiosis';
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
    this.socket.on('server-message', (data: string) => {
      const message = JSON.parse(data) as IMessage;
      us({
        app: {
          messages: (messages: Map<string, Array<IMessage>>) => {
            let messageList = messages.get(message.id) as Array<IMessage>;
            if(!messageList) messageList = new Array<IMessage>();
            messageList.push(message);
            messages.set(message.id, messageList);
            return messages;
          },
        },
      });
    });
  }

  serverInit(s: IAppModel): Promise<Array<IGroup>> {
    return new Promise((resolve) => {
      this.socket.emit('client-init', { callsign: s.app.callsign }, (result: string) => {
        resolve(JSON.parse(result));
      });
    });
  }

  serverCreate(s: IAppModel): Promise<Array<IGroup>> {
    return new Promise((resolve) => {
      this.socket.emit(
        'client-create',
        { callsign: s.app.callsign, group: s.app.selectedFeatures },
        (result: string) => {
          resolve(JSON.parse(result));
        }
      );
    });
  }

  serverUpdate(s: IAppModel, id: string): Promise<Array<IGroup>> {
    return new Promise((resolve) => {
      this.socket.emit(
        'client-update',
        { callsign: s.app.callsign, group: s.app.selectedFeatures, id: id },
        (result: string) => resolve(JSON.parse(result))
      );
    });
  }

  serverDelete(s: IAppModel, id: string): Promise<Array<IGroup>> {
    return new Promise((resolve) => {
      this.socket.emit('client-delete', { callsign: s.app.callsign, id: id }, (result: string) => {
        resolve(JSON.parse(result));
      });
    });
  }

  serverSend(s: IAppModel, group: IGroup, message: string) {
    this.socket.emit(
      'client-message',
      { id: group.id, callsign: s.app.callsign, message: message },
      (result: string) => {}
    );
  }
}
