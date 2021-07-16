import m from 'mithril';
import Stream from 'mithril/stream';
import { merge } from '../utils/mergerino';
import { Feature, FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { Socket } from './socket';
import {
  IAlert,
  IAssistanceResource,
  IChemicalIncident, 
  IChemicalIncidentControlParameters, 
  IChemicalIncidentScenario,
  IGridOptions,
  IGroup,
  IMessage,
  ISensor,
  uuid4,
} from '../../../shared/src';
// @ts-ignore
import ch from '../ch.json';
import mapboxgl, { LinePaint, MapboxGeoJSONFeature } from 'mapbox-gl';

export interface ILayer {
  layerName: string;
  showLayer: boolean;
  type: mapboxgl.AnyLayer;
  layout?: mapboxgl.AnyLayout;
  paint?: mapboxgl.AnyPaint;
  filter?: any[];
}

export const enum SourceType {
  'realtime',
  'grid',
  'custom',
  'alert',
  'chemical_incident',
  'plume'
}

export interface ISource {
  id: string;
  source: FeatureCollection;
  sourceName: string;
  dts?: Array<number>;
  sourceCategory: SourceType
  layers: ILayer[];
  shared: boolean;
  shareWith?: string[];
}

export interface IAppModel {
  app: {
    // Core
    socket: Socket;

    // Alerts
    alerts: Array<IAlert>;
    alert?: IAlert;

    // Clicking/Selecting
    clickedFeature?: MapboxGeoJSONFeature;
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
    sources: Array<ISource>;
    mapStyle: string;
    switchStyle: boolean;
    gridOptions: IGridOptions;
    editLayer: number;
    resourceDict: { [id: string]: IAssistanceResource };
    sensorDict: { [id: string]: ISensor };
    showSatellite: boolean;

    // CHT
    source: {
      scenario: IChemicalIncidentScenario;
      control_parameters: IChemicalIncidentControlParameters;
    };
  };
}

export interface IActions {
  // Core
  drawingCleared: () => void;
  createPOI: () => void;

  // Alerts
  openAlert: (alert: IAlert) => void;

  // Clicking/selecting
  updateClickedFeature: (feature: MapboxGeoJSONFeature) => void;
  updateSelectedFeatures: (features: Array<Feature>) => void;
  resetClickedFeature: () => void;

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
  toggleLayer: (sourceIndex: number, layerIndex: number) => void;
  updateGridLocation: (bbox: [number, number, number, number]) => void;
  updateGridOptions: (gridCellSize: number, updateLocation: boolean) => void;
  updateGrid: (gridSource: FeatureCollection, gridLabelSource: FeatureCollection) => void;
  createCustomLayer: (layerName: string, icon: string, checked: boolean, shareWith: string[]) => void;
  updateCustomLayers: (layerName: string, icon: string, checked: boolean, shareWith: string[]) => void;
  addDrawingsToLayer: (index: number) => void;
  updateDrawings: (feature: Feature) => void;
  deleteLayer: (sourceIndex: number) => void;
  setLayerEdit: (sourceIndex: number) => void;
  toggleSatellite: () => void;

  // CHT
  createCHT: (hazard: Partial<IChemicalIncident>, location: number[]) => void;
  updateCHT: (chemicalIncident: IChemicalIncident) => void;
  setCHOpacities: (val: number, name: string) => void;

  // Populator
  createPopulatorRequest: () => void;
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
      alerts: [] as Array<IAlert>,

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

      sources: [] as Array<ISource>,
      mapStyle: 'mapbox/streets-v11',
      gridOptions: {
        gridCellSize: 0.5,
        updateLocation: false,
        gridLocation: [5.46, 51.42, 5.50, 51.46],
        updateGrid: true,
      } as IGridOptions,
      resourceDict: {} as { [id: string]: IAssistanceResource },
      sensorDict: {} as { [id: string]: ISensor },
      showSatellite: false,

      // CHT
      source: {
        scenario: {} as IChemicalIncidentScenario,
        control_parameters: {} as IChemicalIncidentControlParameters,
      },
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

      setCHOpacities: (val: number, name: string) => {
        us({
          app: {
            sources: (sources: Array<ISource>) => {
              sources.forEach((source: ISource) => {
                if ((source.sourceName + source.id) !== name) return;

                let deltaTime_values = source.dts as Array<number>;

                const dt_len = deltaTime_values.length;
                // assign opacities > 0 to the two deltaTimes surrounding v
                let i1: number = 0;
                let i2: number = 0;
                let opacity1: number = 0.1;
                let opacity2: number = 0.1;
                if (val <= deltaTime_values[0]) {
                  i1 = 0;
                  i2 = -1;
                  opacity1 = 1;
                } else if (val >= deltaTime_values[dt_len - 1]) {
                  i1 = dt_len - 1;
                  opacity1 = 1;
                } else {
                  let i: number;
                  for (i = 0; i < dt_len - 1; i++) {
                    if ((val >= deltaTime_values[i]) && (val <= deltaTime_values[i + 1])) {
                      i1 = i;
                      i2 = i1 + 1;
                      const d1 = val - deltaTime_values[i];
                      const d2 = deltaTime_values[i + 1] - val;
                      opacity1 = 1 - (d1 / (d1 + d2));
                      opacity2 = 1 - (d2 / (d1 + d2));
                    }
                  }
                }
                // assign opacity > 0 to the two deltaTimes surrounding v
                const opacityCalc = (dt = 0) => {
                  const index = deltaTime_values.indexOf(dt);
                  if (index == i1) {
                    return opacity1;
                  } else if ((opacity1 < 1) && (index == i2)) {
                    return opacity2;
                  } else {
                    return 0.05;
                  }
                };

                source.layers.forEach((layer: ILayer, index: number) => {
                  (layer.paint as LinePaint)['line-opacity'] = opacityCalc((source.dts as Array<number>)[index]);
                });
              });
              return sources;
            },
          },
        });
      },

      // Clicking/selecting
      updateClickedFeature: (feature: MapboxGeoJSONFeature) => {
        us({
          app: {
            clickedFeature: () => {
              return feature;
            },
          },
        });
      },
      updateSelectedFeatures: (features: Array<Feature>) => {
        us({ app: { selectedFeatures: { type: 'FeatureCollection', features: features } } });
      },
      resetClickedFeature: () => {
        us({ app: { clickedFeature: undefined } });
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
      toggleLayer: (sourceIndex: number, layerIndex: number) => {
        us({
          app: {
            sources: (sources: Array<ISource>) => {
              // Toggle all layers of a source
              if (layerIndex === -1) {
                sources[sourceIndex].layers.forEach((layer: ILayer) => {
                  layer.showLayer = !layer.showLayer;
                });
                return sources;
              }
              // Toggle one layer (layerIndex) of a source
              else {
                sources[sourceIndex].layers[layerIndex].showLayer = !sources[sourceIndex].layers[layerIndex].showLayer;
                return sources;
              }
            },
          },
        });
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
      updateGrid: (gridSource: FeatureCollection, gridLabelSource: FeatureCollection) => {
        us({
          app: {
            gridOptions: { updateGrid: false },
            sources: (sources: Array<ISource>) => {
              const gridIndex = sources.findIndex((source: ISource) => {
                return source.sourceName === 'GridSource';
              });
              if (gridIndex > -1) {
                sources[gridIndex].source = gridSource;
              } else {
                sources.push({
                  id: 'customGrid',
                  source: gridSource as FeatureCollection,
                  sourceName: 'GridSource',
                  sourceCategory: SourceType.grid,
                  shared: false,
                  layers: [{
                    layerName: 'Grid',
                    showLayer: false,
                    type: { type: 'line' } as mapboxgl.AnyLayer,
                    paint: {
                      'line-opacity': 0.5,
                    },
                  }] as ILayer[],
                } as ISource);
              }

              const labelIndex = sources.findIndex((source: ISource) => {
                return source.sourceName === 'GridLabelSource';
              });
              if (labelIndex > -1) {
                sources[labelIndex].source = gridLabelSource;
              } else {
                sources.push({
                  id: 'customGrid',
                  source: gridLabelSource as FeatureCollection,
                  sourceName: 'GridLabelSource',
                  sourceCategory: SourceType.grid,
                  shared: false,
                  layers: [{
                    layerName: 'Grid Labels',
                    showLayer: false,
                    type: { type: 'symbol' } as mapboxgl.AnyLayer,
                    layout: {
                      'text-field': '{cellLabel}',
                      'text-allow-overlap': true,
                    },
                    paint: {
                      'text-opacity': 0.5,
                    },
                  }] as ILayer[],
                } as ISource);
              }
              return sources;
            },
          },
        });
      },
      createCustomLayer: (layerName: string, icon: string, checked: boolean, shareWith: string[]) => {
        us({
          app: {
            sources: (sources: Array<ISource>) => {
              const gridIndex = sources.findIndex((source: ISource) => {
                return source.sourceName === layerName;
              });
              if (gridIndex > -1) return sources;
              sources.push({
                id: 'testid5',
                source: { type: 'FeatureCollection', features: [] } as FeatureCollection,
                sourceName: layerName,
                sourceCategory: SourceType.custom,
                shared: checked,
                shareWith: shareWith,
                layers: [{
                  layerName: layerName,
                  showLayer: true,
                  type: { type: 'symbol' } as mapboxgl.AnyLayer,
                  layout: {
                    'icon-image': icon,
                    'icon-size': icon === 'ground' ? 0.1 : icon === 'air' ? 0.25 : 0.5,
                    'icon-allow-overlap': true,
                  },
                }] as ILayer[],
              } as ISource);
              return sources;
            },
          },
        });
      },
      updateCustomLayers: (layerName: string, icon: string, checked: boolean, shareWith: string[]) => {
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
            sources: (sources: Array<ISource>) => {
              sources[index].source.features.push(states()['app'].latestDrawing as Feature);
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
      deleteLayer: (sourceIndex: number) => {
        us({
          app: {
            sources: (sources: Array<ISource>) => {
              sources.splice(sourceIndex, 1);
              return sources;
            },
          },
        });
      },
      setLayerEdit: (sourceIndex: number) => {
        us({
          app: {
            editLayer: sourceIndex,
          },
        });
      },
      toggleSatellite: () => {
        us({
          app: {
            showSatellite: !states()['app'].showSatellite,
          }
        })
      },

      //CHT, fix to make this a cht.start message
      createCHT: (hazard: Partial<IChemicalIncident>, location: number[]) => {
        (hazard.scenario as IChemicalIncidentScenario).source_location = location;
        (hazard.scenario as IChemicalIncidentScenario).source_location[2] = 0;
        hazard._id = uuid4();
        hazard.context = 'CTXT20200101100000';

        states()['app'].socket.serverCHT(hazard);
        us({
          app: {
            clearDrawing: {
              delete: true,
              id: states()['app'].latestDrawing.id,
            },
            sources: (sources: ISource[]) => {
              const fc = {
                type: 'FeatureCollection',
                features: [
                  {
                    geometry: {
                      type: 'Point',
                      coordinates: hazard.scenario?.source_location,
                    } as Geometry,
                    properties: {
                      type: 'incidentLocation',
                      scenario: hazard.scenario as IChemicalIncidentScenario,
                      control_parameters: hazard.control_parameters as IChemicalIncidentControlParameters,
                      context: hazard.context,
                      timestamp: hazard.timestamp,
                      id: hazard._id,
                    } as GeoJsonProperties,
                  } as Feature,
                ] as Feature[],
              } as FeatureCollection;
  
              const index = sources.findIndex((source: ISource) => {
                return source.id === hazard._id && source.sourceName === 'IncidentLocation' + hazard._id;
              });
  
              if (index > -1) {
                sources[index].source = fc as FeatureCollection;
              } else {
                sources.push({
                  id: hazard._id,
                  source: fc as FeatureCollection,
                  sourceName: 'IncidentLocation' + hazard._id,
                  sourceCategory: SourceType.chemical_incident,
                  shared: false,
                  layers: [
                    {
                      layerName: 'Incident',
                      showLayer: true,
                      type: { type: 'symbol' } as mapboxgl.AnyLayer,
                      layout: {
                        'icon-image': 'chemical',
                        'icon-size': 0.5,
                        'icon-allow-overlap': true,
                      },
                    },
                  ] as ILayer[],
                } as ISource);
              }
              return sources;
            },
          },
        });
      },

      updateCHT: (chemicalIncident: IChemicalIncident) => {
        states()['app'].socket.serverCHT(chemicalIncident);
        us({
          app: {
            clearDrawing: {
              delete: true,
              id: states()['app'].latestDrawing.id,
            },
            sources: (sources: ISource[]) => {
              const fc = {
                type: 'FeatureCollection',
                features: [
                  {
                    geometry: {
                      type: 'Point',
                      coordinates: chemicalIncident.scenario?.source_location,
                    } as Geometry,
                    properties: {
                      type: 'incidentLocation',
                      scenario: chemicalIncident.scenario as IChemicalIncidentScenario,
                      control_parameters: chemicalIncident.control_parameters as IChemicalIncidentControlParameters,
                      context: chemicalIncident.context,
                      timestamp: chemicalIncident.timestamp,
                      id: chemicalIncident._id,
                    } as GeoJsonProperties,
                  } as Feature,
                ] as Feature[],
              } as FeatureCollection;
  
              const index = sources.findIndex((source: ISource) => {
                return source.id === chemicalIncident._id && source.sourceName === 'IncidentLocation' + chemicalIncident._id;
              });
  
              if (index > -1) {
                sources[index].source = fc as FeatureCollection;
              } else {
                sources.push({
                  id: chemicalIncident._id,
                  source: fc as FeatureCollection,
                  sourceName: 'IncidentLocation' + chemicalIncident._id,
                  sourceCategory: SourceType.chemical_incident,
                  shared: false,
                  layers: [
                    {
                      layerName: 'Incident',
                      showLayer: true,
                      type: { type: 'symbol' } as mapboxgl.AnyLayer,
                      layout: {
                        'icon-image': 'chemical',
                        'icon-size': 0.5,
                        'icon-allow-overlap': true,
                      },
                    },
                  ] as ILayer[],
                } as ISource);
              }
              return sources;
            },
          },
        });
      },

      createPopulatorRequest: async () => {
        const result = await states()['app'].socket.serverPopulator(states()['app'].latestDrawing) as FeatureCollection;

        us({
          app: {
            sources: (sources: Array<ISource>) => {
              const index = sources.findIndex((source: ISource) => {
                return source.sourceName === 'PopulationService';
              });
              if (index > -1) {
                sources[index].source = result as FeatureCollection;
              }
              else {
              sources.push({
                id: 'pop',
                source: result as FeatureCollection,
                sourceName: 'PopulationService',
                sourceCategory: SourceType.realtime,
                shared: false,
                layers: [{
                  layerName: 'Population Data',
                  showLayer: true,
                  type: { type: 'line' } as mapboxgl.AnyLayer,
                  paint: {
                    'line-opacity': 0.5,
                  },
                }] as ILayer[],
              } as ISource);
            }
              return sources;
            },
          },
        });
      }
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
