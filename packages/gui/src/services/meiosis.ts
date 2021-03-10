import m from 'mithril';
import Stream from 'mithril/stream';
import { merge } from '../utils/mergerino';
import io from 'socket.io-client';
import { FeatureCollection } from 'geojson';

export interface IAppModel {
  app: {
    socket: SocketIOClient.Socket;
    positionSource: FeatureCollection;
  };
}

export interface IActions {
  setPositionListener: () => void;
}

/** Application state */
export const appStateMgmt = {
  initial: {
    app: {
      socket: io(process.env.SERVER || 'http://localhost:3000'),
      positionSource: { type: 'FeatureCollection', features: [] } as FeatureCollection,
    },
  },
  actions: (us: UpdateStream, states: Stream<IAppModel>) => {
    return {
      setPositionListener: () => {
        states()['app'].socket?.on('positions', (data: FeatureCollection) => {
          us({ app: { positionSource: data } });
        });
      },
    };
  },
  effects: {},
};

export type ModelUpdateFunction = Partial<IAppModel> | ((model: Partial<IAppModel>) => Partial<IAppModel>);

export type UpdateStream = Stream<Partial<ModelUpdateFunction>>;

const app = {
  initial: Object.assign({}, appStateMgmt.initial) as IAppModel,
  actions: (us: UpdateStream, states: Stream<IAppModel>) =>
    Object.assign({}, appStateMgmt.actions(us, states)) as IActions,
};

const update = Stream<ModelUpdateFunction>();
export const states = Stream.scan(merge, app.initial, update);
export const actions = app.actions(update, states);

states.map((state) => {
  m.redraw();
});
