import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { SourceType, IAppModel, Icon, ILayer, ISource, UpdateStream } from './meiosis';
import io from 'socket.io-client';
import {
  IAlert,
  IGroup,
  IMessage,
  IAssistanceResource,
  ISensor,
  IMeasurement,
  IAttitude,
  ResourceType,
  IChemicalIncident,
  IChemicalIncidentScenario,
  IChemicalIncidentControlParameters,
  ICbrnFeatureCollection,
} from '../../../shared/src';
import M from 'materialize-css';
import mapboxgl from 'mapbox-gl';
import m from 'mithril';
import { ResourceSubtype } from '../../../shared/src/models/resource-value';

export class Socket {
  private socket: SocketIOClient.Socket;
  private resources = {} as { [id: string]: IAssistanceResource };
  private sensors = {} as { [id: string]: ISensor };

  constructor(us: UpdateStream) {
    this.socket = io(process.env.SERVER || 'http://localhost:3000');

    this.socket.on('positions', (data: FeatureCollection) => {
      if (!this.shouldUpdate()) {
      } else {
        us({
          app: {
            sources: (sources: Array<ISource>) => {
              const index = sources.findIndex((source: ISource) => {
                return source.sourceName === 'Positions';
              });
              if (index > -1) {
                sources[index].source = data;
              } else {
                sources.push({
                  id: 'testid1',
                  source: data as FeatureCollection,
                  sourceName: 'Positions',
                  sourceCategory: SourceType.realtime,
                  shared: false,
                  layers: [
                    {
                      layerName: 'Firemen',
                      showLayer: true,
                      icon: Icon.fireman,
                      type: { type: 'symbol' } as mapboxgl.AnyLayer,
                      layout: {
                        'icon-image': 'fireman',
                        'icon-size': 0.5,
                        'icon-allow-overlap': true,
                      },
                      filter: ['all', ['in', 'type', 'man', 'firefighter']],
                    },
                  ] as ILayer[],
                } as ISource);
              }
              return sources;
            },
          },
        });
      }
    });
    this.socket.on('alert', (_data: IAlert) => {
      /* const alertArea = (data.info as IInfo).area as IArea[];

       const fc = JSON.parse(alertArea[0].areaDesc) as FeatureCollection;
       const features = fc.features as Feature[];

       // Find out the necessary layers (DeltaTimes)
       const dts = features.map((feature: Feature) => {
         return feature.properties?.deltaTime;
       }) as number[];

       const uniqueDTs = dts.filter((v, i, a) => a.indexOf(v) === i) as number[];

       // Fix color formatting
       fc.features.forEach((feature: Feature) => {
         // @ts-ignore
         feature.properties.color = '#' + feature.properties?.color as string;
         return feature;
       });

       // Update the fc in the alert
       ((data.info as IInfo).area as IArea[])[0].areaDesc = JSON.stringify(fc);

       us({
         app: {
           sources: (sources: Array<ISource>) => {
             const index = sources.findIndex((source: ISource) => {
               return source.sourceName === data.identifier;
             });
             if (index > -1) {
               sources[index].source = fc;
             } else {
               sources.push({
                 id: 'testid2',
                 source: fc as FeatureCollection,
                 sourceName: 'Eindhoven Chlorine',
                 sourceCategory: SourceType.alert,
                 shared: false,
                 layers: uniqueDTs.map((dt: number) => {
                   return {
                     layerName: dt.toString(),
                     showLayer: true,
                     type: { type: 'line' } as mapboxgl.AnyLayer,
                     paint: {
                         'line-color': {
                           type: 'identity',
                           property: 'color',
                         },
                         'line-opacity': 0.5,
                         'line-width': 2,
                       },
                     filter: ['all', ['in', 'deltaTime', dt]],
                   } as ILayer;
                 }) as Array<ILayer>,
               } as ISource);
             }
           },
           alerts: (alerts: Array<IAlert>) => {
             const index = alerts.findIndex((val: IAlert) => {
               return val.identifier === data.identifier;
             });
             if (index > -1) {
               alerts[index] = data;
               return alerts;
             }
             alerts.push(data);
             return alerts;
           },
         },
       });
       M.toast({ html: 'New Alert' });*/
    });
    this.socket.on('resource', (data: IAssistanceResource) => {
      let features = [] as Feature[];

      this.resources[data._id] = data;

      for (const key in this.resources) {
        let resource = this.resources[key] as IAssistanceResource;
        features.push({
          geometry: resource.geometry,
          properties: {
            type: 'resource',
            resourceType: resource.type as ResourceType,
            resourceSubType: resource.subtype as ResourceSubtype,
            height: resource.height as number,
            id: resource._id as string,
            mission: resource.mission as string,
          } as GeoJsonProperties,
        } as Feature);
      }
      const fc = {
        type: 'FeatureCollection',
        features: features,
      } as FeatureCollection;

      us({
        app: {
          sources: (sources: ISource[]) => {
            const index = sources.findIndex((source: ISource) => {
              return source.sourceName === 'Resources';
            });

            if (index > -1) {
              sources[index].source = fc;
            } else {
              sources.push({
                id: 'resourcesID',
                source: fc as FeatureCollection,
                sourceName: 'Resources',
                sourceCategory: SourceType.realtime,
                shared: false,
                layers: [
                  {
                    layerName: 'Resources',
                    showLayer: true,
                    icon: Icon.helicopter,
                    type: { type: 'symbol' } as mapboxgl.AnyLayer,
                    layout: {
                      'icon-image': 'helicopter',
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
    });
    this.socket.on('sensor', (data: ISensor) => {
      let features = [] as Feature[];

      this.sensors[data._id] = data;

      for (const key in this.sensors) {
        let sensor = this.sensors[key] as ISensor;
        features.push({
          geometry: sensor.geometry,
          properties: {
            type: 'sensor',
            measurement: sensor.measurement as IMeasurement,
            height: sensor.height as number,
            id: sensor._id as string,
            mission: sensor.mission as string,
            context: sensor.context as string,
            sensorType: sensor.type as string,
            attitude: sensor.attitude as IAttitude,
            timestamp: sensor.timestamp as number,
          } as GeoJsonProperties,
        } as Feature);
      }
      const fc = {
        type: 'FeatureCollection',
        features: features,
      } as FeatureCollection;

    this.socket.on('resource', (data: IAssistanceResource) => {
      us({
        app: {
          sources: (sources: ISource[]) => {
            const index = sources.findIndex((source: ISource) => {
              return source.sourceName === 'Sensors';
            });

            if (index > -1) {
              sources[index].source = fc;
            } else {
              sources.push({
                id: 'sensorsID',
                source: fc as FeatureCollection,
                sourceName: 'Sensors',
                sourceCategory: SourceType.realtime,
                shared: false,
                layers: [
                  {
                    layerName: 'Sensors',
                    showLayer: true,
                    icon: Icon.media,
                    type: { type: 'symbol' } as mapboxgl.AnyLayer,
                    layout: {
                      'icon-image': 'media',
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
    });
    this.socket.on('chemical_incident', (data: IChemicalIncident) => {
      us({
        app: {
          sources: (sources: ISource[]) => {
            const fc = {
              type: 'FeatureCollection',
              features: [
                {
                  geometry: {
                    type: 'Point',
                    coordinates: data.scenario.source_location,
                  } as Geometry,
                  properties: {
                    type: 'incidentLocation',
                    scenario: data.scenario as IChemicalIncidentScenario,
                    control_parameters: data.control_parameters as IChemicalIncidentControlParameters,
                    context: data.context,
                    timestamp: data.timestamp,
                    id: data._id,
                  } as GeoJsonProperties,
                } as Feature,
              ] as Feature[],
            } as FeatureCollection;

            const index = sources.findIndex((source: ISource) => {
              return source.id === data._id && source.sourceName === 'IncidentLocation';
            });

            if (index > -1) {
              sources[index].source = fc as FeatureCollection;
            } else {
              sources.push({
                id: data._id,
                source: fc as FeatureCollection,
                sourceName: 'IncidentLocation',
                sourceCategory: SourceType.chemical_incident,
                shared: false,
                layers: [
                  {
                    layerName: 'Incident',
                    showLayer: true,
                    icon: Icon.chemical_incident,
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
      M.toast({ html: 'New Chemical Incident' });
    });
    this.socket.on('plume', (data: ICbrnFeatureCollection) => {
      const features = data.features as Feature[];

      const dts = features.map((feature: Feature) => {
        return feature.properties?.deltaTime;
      }) as number[];

      const uniqueDTs = dts.filter((v, i, a) => a.indexOf(v) === i) as number[];

      features.forEach((feature: Feature) => {
        // @ts-ignore
        feature.properties.color = ('#' + feature.properties?.color) as string;
        return feature;
      });

      us({
        app: {
          sources: (sources: Array<ISource>) => {
            const index = sources.findIndex((source: ISource) => {
              return source.id === data._id && source.sourceName === 'Incident';
            });
            if (index > -1) {
              sources[index].source = data as FeatureCollection;
              sources[index].layers = uniqueDTs.map((dt: number) => {
                return {
                  layerName: dt.toString(),
                  showLayer: true,
                  type: { type: 'line' } as mapboxgl.AnyLayer,
                  paint: {
                    'line-color': {
                      type: 'identity',
                      property: 'color',
                    },
                    'line-opacity': 0.5,
                    'line-width': 2,
                  },
                  filter: ['all', ['in', 'deltaTime', dt]],
                } as ILayer;
              }) as Array<ILayer>;
            } else {
              sources.push({
                id: data._id,
                source: data as FeatureCollection,
                sourceName: 'Incident',
                sourceCategory: SourceType.plume,
                shared: false,
                layers: uniqueDTs.map((dt: number) => {
                  return {
                    layerName: dt.toString(),
                    showLayer: true,
                    type: { type: 'line' } as mapboxgl.AnyLayer,
                    paint: {
                      'line-color': {
                        type: 'identity',
                        property: 'color',
                      },
                      'line-opacity': 0.5,
                      'line-width': 2,
                    },
                    filter: ['all', ['in', 'deltaTime', dt]],
                  } as ILayer;
                }) as Array<ILayer>,
              } as ISource);
            }
            return sources;
          },
        },
      });
    });

    this.socket.on('server-message', (data: string) => {
      const message = JSON.parse(data) as IMessage;
      us({
        app: {
          messages: (messages: Map<string, Array<IMessage>>) => {
            let messageList = messages.get(message.id) as Array<IMessage>;
            if (!messageList) messageList = new Array<IMessage>();
            messageList.push(message);
            messages.set(message.id, messageList);
            return messages;
          },
          newMessages: (messages: { [key: string]: number }) => {
            messages[message.id] += 1;
            return messages;
          },
        },
      });
      M.toast({ html: 'New Chat' });
    });
    this.socket.on('server-notification', (data: string) => {
      const result = JSON.parse(data) as Array<IGroup>;
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
    });
    M.toast({ html: 'Added to a new group' });
  }

  serverInit(s: IAppModel): Promise<Array<IGroup>> {
    return new Promise((resolve) => {
      this.socket.emit('client-init', { callsign: s.app.callsign }, (result: string) => {
        resolve(JSON.parse(result));
      });
    });
  }

  serverCreate(s: IAppModel, name: string): Promise<Array<IGroup>> {
    return new Promise((resolve) => {
      this.socket.emit(
        'client-create',
        { callsign: s.app.callsign, group: s.app.selectedFeatures, name: name },
        (result: string) => {
          resolve(JSON.parse(result));
        },
      );
    });
  }

  serverUpdate(s: IAppModel, id: string, name: string): Promise<Array<IGroup>> {
    return new Promise((resolve) => {
      this.socket.emit(
        'client-update',
        { callsign: s.app.callsign, id: id, name: name },
        (result: string) => resolve(JSON.parse(result)),
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
      (_result: string) => {
      },
    );
  }

  serverCHT(chemicalIncident: Partial<IChemicalIncident>) {
    this.socket.emit('client-cht', { hazard: chemicalIncident }, (_result: string) => {
    });
  }

  shouldUpdate(): boolean {
    // If we are not on the map page, don't update locations
    if (m.route.get() !== '/map') return false;
    let update: boolean = true;
    const elems = document.querySelectorAll('.modal');
    elems.forEach((elem: Element) => {
      if (M.Modal.getInstance(elem).isOpen) update = false;
    });
    return update;
  }
}
