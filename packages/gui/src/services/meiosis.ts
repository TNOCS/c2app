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

const update = Stream<ModelUpdateFunction>();

/** Application state */
export const appStateMgmt = {
  initial: {
    app: {
      socket: new Socket(update),
      positionSource: {} as FeatureCollection,
      chemicalHazardSource: {} as FeatureCollection,
      groups: [] as IGroup[]
    },
  },
  actions: (us: UpdateStream, states: Stream<IAppModel>) => {
    return {
      updateClickedFeature: (feature: Feature) => {
        us({ app: { clickedFeature: feature } });
      },
      updateSelectedFeatures: (features: Feature[]) => {
        us({ app: { selectedFeatures: {type: 'FeatureCollection', features: features} } });
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
                groups.push({data: states()['app'].selectedFeatures as FeatureCollection, id: uuid4()});
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
              if(id > -1) groups[id].data = states()['app'].selectedFeatures as FeatureCollection;
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
              if(id > -1) groups.splice(id, 1);
              return groups;
            },
          },
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

export const states = Stream.scan(merge, app.initial, update);
export const actions = app.actions(update, states);

states.map((_state) => {
  m.redraw();
});
