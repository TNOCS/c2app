import m from 'mithril';
import Stream from 'mithril/stream';
import { merge } from '../utils/mergerino';
import { Feature, FeatureCollection } from 'geojson';
import { Socket } from './socket';
import { uuid4 } from '../utils/index';

export interface IAppModel {
  app: {
    socket: Socket;
    positionSource: FeatureCollection;
    chemicalHazardSource: FeatureCollection;
    groups: IGroup[];
    clickedFeature?: Feature;
    selectedFeatures?: FeatureCollection;
    alerts?: string;
  };
}

export interface IGroup {
  data: FeatureCollection;
  id: string;
}

export interface IActions {
  updateClickedFeature: (feature: Feature) => void;
  updateSelectedFeatures: (features: Feature[]) => void;
  resetClickedFeature: () => void;
  resetSelectedFeatures: () => void;
  groupSelectedFeatures: () => void;
  updateGroup: (group: IGroup) => void;
  removeGroup: (group: IGroup) => void;
}

export type ModelUpdateFunction = Partial<IAppModel> | ((model: Partial<IAppModel>) => Partial<IAppModel>);
export type UpdateStream = Stream<Partial<ModelUpdateFunction>>;
const update = Stream<ModelUpdateFunction>();

/** Application state */
export const appStateMgmt = {
  initial: {
    app: {
      socket: new Socket(update),
      positionSource: {} as FeatureCollection,
      chemicalHazardSource: {} as FeatureCollection,
      groups: [] as IGroup[],
    },
  },
  actions: (us: UpdateStream, states: Stream<IAppModel>) => {
    return {
      updateClickedFeature: (feature: Feature) => {
        us({ app: { clickedFeature: feature } });
      },
      updateSelectedFeatures: (features: Feature[]) => {
        us({ app: { selectedFeatures: { type: 'FeatureCollection', features: features } } });
      },
      resetClickedFeature: () => {
        us({ app: { clickedFeature: undefined } });
      },
      resetSelectedFeatures: () => {
        us({ app: { selectedFeatures: undefined } });
      },
      groupSelectedFeatures: () => {
        us({
          app: {
            groups: (groups: IGroup[]) => {
              if (states()['app'].selectedFeatures)
                groups.push({ data: states()['app'].selectedFeatures as FeatureCollection, id: uuid4() });
              return groups;
            },
          },
        });
      },
      updateGroup: (group: IGroup) => {
        us({
          app: {
            groups: (groups: IGroup[]) => {
              const id = groups.findIndex((element: IGroup) => {
                return element.id == group.id;
              });
              if (id > -1) groups[id].data = states()['app'].selectedFeatures as FeatureCollection;
              return groups;
            },
          },
        });
      },
      removeGroup: (group: IGroup) => {
        us({
          app: {
            groups: (groups: IGroup[]) => {
              const id = groups.findIndex((element: IGroup) => {
                return element.id == group.id;
              });
              if (id > -1) groups.splice(id, 1);
              return groups;
            },
          },
        });
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
  // Services that run everytime the state is updated
  services: [(s) => console.log(s.app.socket.connected())] as Array<(s: IAppModel) => Partial<IAppModel> | void>,
  // Effects run from state update until some condition is met (can cause infinite loop)
  effects: (_update: UpdateStream, _actions: IActions) => [] as Array<(state: IAppModel) => Promise<void>>,
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
