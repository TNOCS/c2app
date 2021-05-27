import m from 'mithril';
import Stream from 'mithril/stream';
import { merge } from '../utils/mergerino';
import { Feature, FeatureCollection } from 'geojson';
import { Socket } from './socket';
import {
  IAlert,
  IChemicalHazard,
  IControlParameters,
  IGridOptions,
  IGroup,
  IInfo,
  IMessage,
  IScenarioDefinition,
} from '../../../shared/src';

export interface IAppModel {
  app: {
    // Core
    socket: Socket;

    // Alerts
    alerts: Array<IAlert>;
    alert?: IAlert;

    // Positions
    positionSource: FeatureCollection;

    // Clicking/Selecting
    clickedFeature?: Feature;
    selectedFeatures?: FeatureCollection;
    latestDrawing: Feature;
    clearDrawing: {
      delete: boolean,
      id: string
    },

    // Groups
    groups: Array<IGroup>;
    editGroup: number;

    // Profile
    profile: '' | 'commander' | 'firefighter';
    callsign?: string;

    // Chat
    messages: Map<string, Array<IMessage>>;
    chat?: IGroup;
    newMessages: { [key: string]: number };

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
    editLayer: number;

    // CHT
    source: {
      scenario: IScenarioDefinition;
      control_parameters: IControlParameters;
    };
    CHTSource: FeatureCollection;
    CHTLayers: Array<[string, boolean]>;
  };
}

export interface IActions {
  // Core
  drawingCleared: () => void;
  createPOI: () => void;

  // Alerts
  openAlert: (alert: IAlert) => void;

  // Clicking/selecting
  updateClickedFeature: (feature: Feature) => void;
  updateSelectedFeatures: (features: Array<Feature>) => void;
  resetClickedFeature: () => void;
  resetSelectedFeatures: () => void;

  // Groups
  initGroups: () => void;
  createGroup: (name: string) => void;
  updateGroup: (index: number, name: string) => void;
  deleteGroup: (group: IGroup) => void;
  setGroupEdit: (index: number) => void;

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
  updateCustomLayers: (layerName: string) => void;
  addDrawingsToLayer: (index: number) => void;
  updateDrawings: (feature: Feature) => void;
  deleteLayer: (index: number) => void;
  setLayerEdit: (index: number) => void;

  // CHT
  submitCHT: (hazard: Partial<IChemicalHazard>, location: number[]) => void;
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
      latestDrawing: {} as Feature,
      clearDrawing: {
        delete: false,
        id: '',
      },

      // Groups
      groups: Array<IGroup>(),

      // Profile
      profile: '',

      // Chat
      messages: new Map<string, Array<IMessage>>(),
      newMessages: {} as { [key: string]: number },

      // Layers/styles
      mapStyle: 'mapbox/streets-v11',
      realtimeLayers: [['firemenPositions', true]] as Array<[string, boolean]>,
      gridLayers: [['grid', false], ['gridLabels', false]] as Array<[string, boolean]>,
      sensorLayers: [] as Array<[string, boolean]>,
      customLayers: [] as Array<[string, boolean]>,
      alertLayers: /*[] as Array<[string, boolean]>,*/ [['agent-smith', true], ['agent-smith-2', true]] as Array<[string, boolean]>,
      gridOptions: {
        gridCellSize: 0.5,
        updateLocation: false,
        gridLocation: [5.46, 51.42, 5.50, 51.46],
        updateGrid: true,
      } as IGridOptions,
      customSources: [] as Array<FeatureCollection>,

      // CHT
      source: {
        scenario: {} as IScenarioDefinition,
        control_parameters: {} as IControlParameters,
      },
      CHTSource: {} as FeatureCollection,
      CHTLayers: [] as Array<[string, boolean]>,
    },
  },
  actions: (us: UpdateStream, states: Stream<IAppModel>) => {
    return {
      // Core
      drawingCleared: () => {
        us({
          app: {
            clearDrawing: { delete: false, id: '' },
            drawings: undefined,
          },
        });
      },
      createPOI: () => {
        us({
          app: {
            gridOptions: { updateGrid: true },
          },
        });
      },

      // Alerts
      openAlert: (alert: IAlert) => {
        us({
          app: {
            alert: () => {
              return alert;
            },
          },
        });
      },

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
            newMessages: (messages: { [key: string]: number }) => {
              result.forEach((group: IGroup) => {
                messages[group.id] = 0;
              });
              return messages;
            },
          },
        });
      },
      createGroup: async (name: string) => {
        us({
          app: {
            clearDrawing: { delete: true, id: states()['app'].latestDrawing.id },
          },
        });
        if (!states()['app'].selectedFeatures) return;
        const result = await states()['app'].socket.serverCreate(states(), name);
        us({
          app: {
            groups: () => {
              return result;
            },
            newMessages: (messages: { [key: string]: number }) => {
              result.forEach((group: IGroup) => {
                if (!messages[group.id]) messages[group.id] = 0;
              });
              return messages;
            },
          },
        });
      },
      updateGroup: async (index: number, name: string) => {
        const group = states()['app'].groups[index];
        const result = await states()['app'].socket.serverUpdate(states(), group.id, name);
        us({
          app: {
            groups: () => {
              return result;
            },
            newMessages: (messages: { [key: string]: number }) => {
              result.forEach((group: IGroup) => {
                if (!messages[group.id]) messages[group.id] = 0;
              });
              return messages;
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
            newMessages: (messages: { [key: string]: number }) => {
              messages[group.id] = 0;
              return messages;
            },
          },
        });
      },
      sendChat: (group: IGroup, message: string) => {
        states()['app'].socket.serverSend(states(), group, message);
      },
      setGroupEdit: (index: number) => {
        us({
          app: {
            editGroup: index,
          },
        });
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
          case 'CHT':
            us({
              app: {
                CHTLayers: (layers: Array<[string, boolean]>) => {
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
      updateCustomLayers: (layerName: string) => {
        us({
          app: {
            customLayers: (layers: Array<[string, boolean]>) => {
              layers.push([layerName, false] as [string, boolean]);
              return layers;
            },
            customSources: (sources: Array<FeatureCollection>) => {
              sources.push({
                type: 'FeatureCollection',
                features: [] as Feature[],
              } as FeatureCollection);
              return sources;
            },
          },
        });
      },
      addDrawingsToLayer: (index: number) => {
        us({
          app: {
            customSources: (sources: Array<FeatureCollection>) => {
              if (index < sources.length) {
                let features = sources[index].features as Feature[];
                features.push(states()['app'].latestDrawing as Feature);
                sources[index].features = features;
              } else {
                sources.push({
                  type: 'FeatureCollection',
                  features: [states()['app'].latestDrawing as Feature],
                });
              }
              return sources;
            },
            clearDrawing: {
              delete: true,
              id: states()['app'].latestDrawing.id,
            },
          },
        });
      },
      updateDrawings: (feature: Feature) => {
        us({ app: { latestDrawing: feature } });
      },
      deleteLayer: (index: number) => {
        us({
          app: {
            customLayers: (layers: Array<[string, boolean]>) => {
              layers.splice(index, 1);
              return layers;
            },
            customSources: (layers: Array<FeatureCollection>) => {
              layers.splice(index, 1);
              return layers;
            },
          },
        });
      },
      setLayerEdit: (index: number) => {
        us({
          app: {
            editLayer: index,
          },
        });
      },

      //CHT
      submitCHT: async (hazard: Partial<IChemicalHazard>, location: number[]) => {
        (hazard.scenario as IScenarioDefinition).source_location = location;
        (hazard.scenario as IScenarioDefinition).source_location[2] = 0;

        const result = await states()['app'].socket.serverCHT(hazard) as FeatureCollection;
        const features = result.features as Feature[];

        const dts = features.map((feature: Feature) => {
          return feature.properties?.deltaTime;
        }) as number[];

        const uniqueDTs = dts.filter((v, i, a) => a.indexOf(v) === i) as number[];

        const CHTLayers = uniqueDTs.map((dt: number) => {
          return [dt.toString(), true];
        }) as Array<[string, boolean]>;

        result.features = features.map((feature: Feature) => {
          // @ts-ignore
          feature.properties.color = '#' + feature.properties?.color as string;
          return feature;
        });

        us({
          app: {
            CHTSource: () => {
              return result;
            },
            CHTLayers: () => {
              return CHTLayers;
            },
          },
        });
        m.redraw();
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
