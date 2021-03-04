import Stream from 'mithril/stream';
import { merge } from 'mergerino';
import io from "socket.io-client";

/** Application state */
export const appStateMgmt = {
  initial: {
    app: {
      socket: io(process.env.SERVER || 'http://localhost:3000')
    },
  },
  actions: (us: UpdateStream) => {
    return {
    };
  },
  effects: {},
};

export interface IAppModel {
  app: Partial<{
    socket: SocketIOClient.Socket;
  }>;
}

export interface IActions {
}

export type ModelUpdateFunction =
  | Partial<IAppModel>
  | ((model: Partial<IAppModel>) => Partial<IAppModel>);
export type UpdateStream = Stream<ModelUpdateFunction>;

const app = {
  initial: Object.assign({}, appStateMgmt.initial),
  actions: (us: UpdateStream) =>
    Object.assign({}, appStateMgmt.actions(us)) as IActions,
};

const update = Stream<ModelUpdateFunction>();
export const states = Stream.scan(merge, app.initial, update);
export const actions = app.actions(update);