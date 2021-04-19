import m from 'mithril';
import Stream from 'mithril/stream';
import { merge } from '../utils/mergerino';
import { Feature, FeatureCollection } from 'geojson';
import { Socket } from './socket';

export interface IAppModel {
  app: {
    socket: Socket;
    positionSource: FeatureCollection;
    chemicalHazardSource: FeatureCollection;
    groups: Array<IGroup>;
    profile: '' | 'commander' | 'firefighter';
    callsign?: string;
    clickedFeature?: Feature;
    selectedFeatures?: FeatureCollection;
    alerts?: string;
    chat?: IGroup;
    messages: Map<string, Array<IMessage>>
  };
}

export interface IMessage {
  id: string;
  sender: string;
  message: string;
}

export interface IGroup {
  id: string;
  callsigns: Array<string>;
  owner: string;
}

export interface IActions {
  updateClickedFeature: (feature: Feature) => void;
  updateSelectedFeatures: (features: Array<Feature>) => void;
  resetClickedFeature: () => void;
  resetSelectedFeatures: () => void;

  initGroups: () => void;
  createGroup: () => void;
  updateGroup: (group: IGroup) => void;
  deleteGroup: (group: IGroup) => void;

  updateProfile: (data: string) => void;
  updateCallsign: (data: string) => void;

  openChat: (group: IGroup) => void;
  closeChat: () => void;
  sendChat: (group: IGroup, message: string) => void;
}

export type ModelUpdateFunction = Partial<IAppModel> | ((model: Partial<IAppModel>) => Partial<IAppModel>);
export type UpdateStream = Stream<Partial<ModelUpdateFunction>>;
const update = Stream<ModelUpdateFunction>();

/** Application state */
export const appStateMgmt = {
  initial: {
    app: {
      profile: '',
      socket: new Socket(update),
      positionSource: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {
              callsign: '123',
              type: 'firefighter',
            },
            geometry: {
              type: 'Point',
              coordinates: [5.48, 51.442],
            },
          },
          {
            type: 'Feature',
            properties: {
              callsign: '111',
              type: 'firefighter',
            },
            geometry: {
              type: 'Point',
              coordinates: [5.48, 51.441],
            },
          },
        ],
      } as FeatureCollection,
      chemicalHazardSource: {} as FeatureCollection,
      groups: Array<IGroup>(),
      messages: new Map<string, Array<IMessage>>(),
    },
  },
  actions: (us: UpdateStream, states: Stream<IAppModel>) => {
    return {
      updateClickedFeature: (feature: Feature) => {
        us({ app: { clickedFeature: feature } });
      },
      updateSelectedFeatures: (features: Array<Feature>) => {
        us({ app: { selectedFeatures: { type: 'FeatureCollection', features: features } } });
      },
      resetClickedFeature: () => {
        us({ app: { clickedFeature: undefined } });
      },
      resetSelectedFeatures: () => {
        us({ app: { selectedFeatures: undefined } });
      },
      initGroups: async () => {
        const result = await states()['app'].socket.serverInit(states());
        us({
          app: {
            groups: () => {
              return result;
            },
          },
        });
      },
      createGroup: async () => {
        if(!states()['app'].selectedFeatures) return;
        const result = await states()['app'].socket.serverCreate(states());
        us({
          app: {
            groups: () => {
              return result;
            },
          },
        });
      },
      updateGroup: async (group: IGroup) => {
        if(!states()['app'].selectedFeatures) return;
        const result = await states()['app'].socket.serverUpdate(states(), group.id);
        us({
          app: {
            groups: () => {
              return result;
            },
          },
        });
      },
      deleteGroup: async (group: IGroup) => {
        const result = await states()['app'].socket.serverDelete(states(), group.id);
        us({
          app: {
            groups: () => {
              return result;
            },
          },
        });
      },
      updateProfile: (data: string) => {
        us({
          app: {
            profile: () => {
              return data;
            },
          },
        });
      },
      updateCallsign: (data: string) => {
        us({
          app: {
            callsign: () => {
              return data;
            },
          },
        });
      },
      openChat: (group: IGroup) => {
        us({
          app: {
            chat: () => {
              return group;
            },
          },
        });
      },
      closeChat: () => {
        us({
          app: {
            chat: undefined,
          },
        });
      },
      sendChat: (group: IGroup, message: string) => {
        states()['app'].socket.serverSend(states(), group, message);
      },
    };
  },
};

const app = {
  // Initial state of the appState
  initial: Object.assign({}, appStateMgmt.initial) as IAppModel,
  // Actions that can be called to update the state
  actions: (us: UpdateStream, states: Stream<IAppModel>) =>
    Object.assign({}, appStateMgmt.actions(us, states)) as IActions,
  // Services that run everytime the state is updated (so after the action is done)
  services: [] as Array<(s: IAppModel) => Partial<IAppModel> | void>,
  // Effects run from state update until some condition is met (can cause infinite loop)
  effects: (_update: UpdateStream, _actions: IActions) => [] as Array<(state: IAppModel) => Promise<void> | void>,
};

const runServices = (startingState: IAppModel) =>
  app.services.reduce(
    (state: IAppModel, service: (s: IAppModel) => Partial<IAppModel> | void) => merge(state, service(state)),
    startingState
  );

export const states = Stream.scan((state, patch) => runServices(merge(state, patch)), app.initial, update);
export const actions = app.actions(update, states);
const effects = app.effects(update, actions);

states.map((state) => {
  effects.forEach((effect) => effect(state));
  m.redraw();
});
