import m from 'mithril';
import Stream from 'mithril/stream';
import { merge } from '../utils/mergerino';
import { Feature, FeatureCollection } from 'geojson';
import { Socket } from './socket';
import { IAlert, IInfo } from '../types';

export interface IAppModel {
  app: {
    // Core
    socket: Socket;
    clearDrawing: boolean;

    // Alerts
    alerts: Array<IAlert>;

    // Positions
    positionSource: FeatureCollection;

    // Clicking/Selecting
    clickedFeature?: Feature;
    selectedFeatures?: FeatureCollection;
    drawings: FeatureCollection;

    // Groups
    groups: Array<IGroup>;

    // Profile
    profile: '' | 'commander' | 'firefighter';
    callsign?: string;

    // Chat
    messages: Map<string, Array<IMessage>>;
    chat?: IGroup;

    // Layers/styles
    mapStyle: string;
    switchStyle: boolean;
    realtimeLayers: Array<[string, boolean]>;
    gridLayers: Array<[string, boolean]>;
    sensorLayers: Array<[string, boolean]>;
    customLayers: Array<[string, boolean]>;
    alertLayers: Array<[string, boolean]>;
    gridOptions: IGridOptions;
    customSources: Array<FeatureCollection>;
  };
}

export interface IActions {
  // Core
  drawingCleared: () => void;
  createPOI: () => void;

  // Clicking/selecting
  updateClickedFeature: (feature: Feature) => void;
  updateSelectedFeatures: (features: Array<Feature>) => void;
  resetClickedFeature: () => void;
  resetSelectedFeatures: () => void;

  // Groups
  initGroups: () => void;
  createGroup: () => void;
  updateGroup: (group: IGroup) => void;
  deleteGroup: (group: IGroup) => void;

  // Profile
  updateProfile: (data: string) => void;
  updateCallsign: (data: string) => void;

  // Chat
  openChat: (group: IGroup) => void;
  sendChat: (group: IGroup, message: string) => void;

  // Layers/styles
  switchStyle: (style: string) => void;
  toggleLayer: (selector: string, index: number) => void;
  updateGridLocation: (bbox: [number, number, number, number]) => void;
  updateGridOptions: (gridCellSize: number, updateLocation: boolean) => void;
  updateGridDone: () => void;
  updateCustomLayers: (layerName: string, addCurrentDrawings: boolean) => void;
  addDrawingsToLayer: (index: number) => void;
  updateDrawings: (features: FeatureCollection) => void;
}

export interface IGridOptions {
  gridCellSize: number;
  updateLocation: boolean;
  gridLocation: [number, number, number, number];
  updateGrid: boolean;
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

export type ModelUpdateFunction = Partial<IAppModel> | ((model: Partial<IAppModel>) => Partial<IAppModel>);
export type UpdateStream = Stream<Partial<ModelUpdateFunction>>;
const update = Stream<ModelUpdateFunction>();

/** Application state */
export const appStateMgmt = {
  initial: {
    app: {
      // Core
      socket: new Socket(update),
      clearDrawing: false,

      // Alerts
      alerts: /*[] as Array<IAlert>,*/ [
        {
          identifier: 'agent-smith',
          sender: 'agent-smith',
          sent: 'agent-smith',
          status: 'Exercise',
          msgType: 'Alert',
          scope: 'Restricted',
          info: {
            category: 'Rescue',
            event: 'Testing cap messages',
            urgency: 'Immediate',
            severity: 'Extreme',
            certainty: 'Likely',
            area: [
              {
                areaDesc: 'polygon layer',
                polygon: [
                  '5.477628707885741, 51.443763428806044',
                  '5.4743242263793945, 51.44181075517023',
                  '5.477542877197266, 51.43921597746186',
                  '5.485525131225586, 51.440633760869964',
                  '5.486512184143066, 51.44403091184326',
                  '5.4817914962768555, 51.447481302560234',
                  '5.480632781982422, 51.443549441248216',
                  '5.477628707885741, 51.443763428806044',
                ],
              },
            ],
          } as IInfo,
        } as IAlert,
        {
          identifier: 'agent-smith-2',
          sender: 'agent-smith',
          sent: 'agent-smith',
          status: 'Exercise',
          msgType: 'Alert',
          scope: 'Restricted',
          info: {
            category: 'Rescue',
            event: 'Testing cap messages',
            urgency: 'Immediate',
            severity: 'Extreme',
            certainty: 'Likely',
            area: [
              {
                areaDesc: 'polygon layer',
                polygon: [
                  '5.496425628662109, 51.443683183589364',
                  '5.488529205322266, 51.43972424449905',
                  '5.496683120727539, 51.43758413453405',
                  '5.496425628662109, 51.443683183589364',
                ],
              },
            ],
          } as IInfo,
        } as IAlert,
      ] as Array<IAlert>,

      // Positions
      positionSource: /*{} as FeatureCollection,*/ {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {
              name: '123',
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
              name: '111',
              type: 'firefighter',
            },
            geometry: {
              type: 'Point',
              coordinates: [5.48, 51.441],
            },
          },
        ],
      } as FeatureCollection,

      // Clicking/Selecting
      drawings: {} as FeatureCollection,

      // Groups
      groups: Array<IGroup>(),

      // Profile
      profile: '',

      // Chat
      messages: new Map<string, Array<IMessage>>(),

      // Layers/styles
      mapStyle: 'mapbox/streets-v11',
      realtimeLayers: [['firemenPositions', true], ['carPositions', true]] as Array<[string, boolean]>,
      gridLayers: [['grid', false], ['gridLabels', false]] as Array<[string, boolean]>,
      sensorLayers: [] as Array<[string, boolean]>,
      customLayers: [] as Array<[string, boolean]>,
      alertLayers: [] as Array<[string, boolean]>, //[['agent-smith', true], ['agent-smith-2', true]] as Array<[string, boolean]>,
      gridOptions: {
        gridCellSize: 0.5,
        updateLocation: false,
        gridLocation: [5.46, 51.42, 5.50, 51.46],
        updateGrid: true,
      } as IGridOptions,
      customSources: [] as Array<FeatureCollection>,
    },
  },
  actions: (us: UpdateStream, states: Stream<IAppModel>) => {
    return {
      // Core
      drawingCleared: () => {
        us({
          app: {
            clearDrawing: false,
            drawings: undefined,
          },
        });
      },
      createPOI: () => {},

      // Clicking/selecting
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

      //Groups
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
        us({
          app: {
            clearDrawing: true,
          },
        });
        if (!states()['app'].selectedFeatures) return;
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
        us({
          app: {
            clearDrawing: true,
          },
        });
        if (!states()['app'].selectedFeatures) return;
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

      // Profile
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

      // Chat
      openChat: (group: IGroup) => {
        us({
          app: {
            chat: () => {
              return group;
            },
          },
        });
      },
      sendChat: (group: IGroup, message: string) => {
        states()['app'].socket.serverSend(states(), group, message);
      },

      // Layers/style
      switchStyle: (style: string) => {
        us({
          app: {
            mapStyle: style,
          },
        });
      },
      toggleLayer: (selector: string, index: number) => {
        switch (selector) {
          case 'realtime':
            us({
              app: {
                realtimeLayers: (layers: Array<[string, boolean]>) => {
                  layers[index] = [layers[index][0], !layers[index][1]];
                  return layers;
                },
              },
            });
            break;
          case 'grid':
            us({
              app: {
                gridLayers: (layers: Array<[string, boolean]>) => {
                  layers[index] = [layers[index][0], !layers[index][1]];
                  return layers;
                },
              },
            });
            break;
          case 'custom':
            us({
              app: {
                customLayers: (layers: Array<[string, boolean]>) => {
                  layers[index] = [layers[index][0], !layers[index][1]];
                  return layers;
                },
              },
            });
            break;
          case 'alert':
            us({
              app: {
                alertLayers: (layers: Array<[string, boolean]>) => {
                  layers[index] = [layers[index][0], !layers[index][1]];
                  return layers;
                },
              },
            });
            break;
        }
      },
      updateGridOptions: (gridCellSize: number, updateLocation: boolean) => {
        us({
          app: {
            gridOptions: { gridCellSize: gridCellSize, updateLocation: updateLocation, updateGrid: true },
          },
        });
      },
      updateGridLocation: (bbox: [number, number, number, number]) => {
        us({
          app: {
            gridOptions: { gridLocation: bbox },
          },
        });
      },
      updateGridDone: () => {
        us({
          app: {
            gridOptions: { updateGrid: false },
          },
        });
      },
      updateCustomLayers: (layerName: string, addCurrentDrawings: boolean) => {
        us({
          app: {
            customLayers: (layers: Array<[string, boolean]>) => {
              layers.push([layerName, false] as [string, boolean]);
              return layers;
            },
            customSources: (sources: Array<FeatureCollection>) => {
              if (addCurrentDrawings) {
                sources.push(states()['app'].drawings as FeatureCollection);
              }
              return sources;
            },
            clearDrawing: true,
          },
        });
      },
      addDrawingsToLayer: (index: number) => {
        us({
          app: {
            customSources: (sources: Array<FeatureCollection>) => {
              if (index < sources.length) {
                sources[index] = states()['app'].drawings as FeatureCollection;
              } else {
                sources.push(states()['app'].drawings as FeatureCollection);
              }
              return sources;
            },
            clearDrawing: true,
          },
        });
      },
      updateDrawings: (features: FeatureCollection) => {
        us({ app: { drawings: features } });
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
    startingState,
  );

export const states = Stream.scan((state, patch) => runServices(merge(state, patch)), app.initial, update);
export const actions = app.actions(update, states);
const effects = app.effects(update, actions);

states.map((state) => {
  effects.forEach((effect) => effect(state));
  m.redraw();
});
