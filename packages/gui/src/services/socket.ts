import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { SourceType, IAppModel, ILayer, ISource, UpdateStream } from './meiosis';
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
  IContext,
  IAssistanceMessage,
  IInfo,
  IArea
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
    // ASSISTANCE context
    this.socket.on('context', (data: IContext) => {
      const fc = {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          geometry: data.geometry,
          properties: {
            id: data._id,
            description: data.description,
            start: data.start,
            timestamp: data.timestamp,
            type: 'context'
          }
        } as Feature] as Feature[]
      } as FeatureCollection
      us({
        app: {
          sources: (sources: ISource[]) => {
            const index = sources.findIndex((source: ISource) => {
              return source.sourceName === 'Contexts';
            });

            if (index > -1) {
              sources[index].source = fc;
            } else {
              sources.push({
                id: 'contextsID',
                source: fc as FeatureCollection,
                sourceName: 'Contexts',
                sourceCategory: SourceType.realtime,
                shared: false,
                layers: [{
                    layerName: 'Contexts',
                    showLayer: true,
                    type: { type: 'line' } as mapboxgl.AnyLayer,
                    paint: {
                      'line-width': 4,
                    }
                  } as ILayer
                 ] as ILayer[],
              } as ISource);
            }
            return sources;
          },
        },
      });
    });
    // ASSISTANCE resource
    this.socket.on('resource', (data: IAssistanceResource) => {
      let features = [] as Feature[];
      let resourceTypes: Array<string> = [];

      this.resources[data._id] = data;

      for (const key in this.resources) {
        let resource = this.resources[key] as IAssistanceResource;

        resourceTypes.push(resource.subtype);

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

      const uniqueTypes = resourceTypes.filter((v, i, a) => a.indexOf(v) === i) as Array<string>;

      us({
        app: {
          sources: (sources: ISource[]) => {
            const index = sources.findIndex((source: ISource) => {
              return source.sourceName === 'Resources';
            });

            if (index > -1) {
              sources[index].source = fc;
              sources[index].layers = uniqueTypes.map((type: string) => {
                return {
                  layerName: type + 'Resources',
                  showLayer: true,
                  type: { type: 'symbol' } as mapboxgl.AnyLayer,
                  layout: {
                    'icon-image': type,
                    'icon-size': type === 'GROUND' ? 0.1 : type === 'AIR' ? 0.25 : 0.5,
                    'icon-allow-overlap': true,
                  },
                  filter: ['all', ['in', 'resourceSubType', type]],
                } as ILayer
              }) as ILayer[]
            } else {
              sources.push({
                id: 'resourcesID',
                source: fc as FeatureCollection,
                sourceName: 'Resources',
                sourceCategory: SourceType.realtime,
                shared: false,
                layers: uniqueTypes.map((type: string) => {
                  return {
                    layerName: type + 'Resources',
                    showLayer: true,
                    type: { type: 'symbol' } as mapboxgl.AnyLayer,
                    layout: {
                      'icon-image': type,
                      'icon-size': type === 'GROUND' ? 0.1 : type === 'AIR' ? 0.25 : 0.5,
                      'icon-allow-overlap': true,
                    },
                    filter: ['all', ['in', 'resourceSubType', type]],
                  } as ILayer
                }) as ILayer[],
              } as ISource);
            }
            return sources;
          },
        },
      });
    });
    // ASSISTANCE sensor
    this.socket.on('sensor', (data: ISensor) => {
      let features = [] as Feature[];
      let sensorMissions: Array<string> = [];

      this.sensors[data._id] = data;

      for (const key in this.sensors) {
        let sensor = this.sensors[key] as ISensor;
        sensorMissions.push(sensor.mission);
      }

      const uniqueSensorMissions = sensorMissions.filter((v, i, a) => a.indexOf(v) === i) as Array<string>;

      uniqueSensorMissions.forEach((mission: string) => {
        const sensorList: Array<ISensor> = [];
        for (const key in this.sensors) {
          let sensor = this.sensors[key] as ISensor;
          if(sensor.mission !== mission) return;
          sensorList.push(sensor);
        }

        features.push({
          geometry: sensorList[0].geometry,
          properties: {
            type: 'sensor',
            sensors: sensorList.map((sensor: ISensor) => {
              return {
                measurement: sensor.measurement as IMeasurement,
                height: sensor.height as number,
                id: sensor._id as string,
                mission: sensor.mission as string,
                context: sensor.context as string,
                sensorType: sensor.type as string,
                attitude: sensor.attitude as IAttitude,
                timestamp: sensor.timestamp as number,
              }
            })
          } as GeoJsonProperties,
        } as Feature);
      })

      const fc = {
        type: 'FeatureCollection',
        features: features,
      } as FeatureCollection;

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
    // ASSISTANCE cht.start
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
    // ASSISTANCE plume
    this.socket.on('plume', (data: ICbrnFeatureCollection) => {
      const features = data.features as Feature[];

      const dts = features.map((feature: Feature) => {
        return feature.properties?.deltaTime;
      }) as number[];

      const uniqueDTs = dts.filter((v, i, a) => a.indexOf(v) === i) as number[];

      features.forEach((feature: Feature) => {
        // @ts-ignore
        feature.properties.color = ('#' + feature.properties?.color) as string;
        feature.properties = {
          ...feature.properties,
          type: 'plume',
        } as GeoJsonProperties;
        return feature;
      });
      uniqueDTs.sort((a, b) => a - b);

      us({
        app: {
          sources: (sources: Array<ISource>) => {
            const index = sources.findIndex((source: ISource) => {
              return source.id === data._id && source.sourceName === 'Incident';
            });
            if (index > -1) {
              sources[index].source = data as FeatureCollection;
              sources[index].dts = uniqueDTs as Array<number>;
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
                    'line-width': 6,
                  },
                  filter: ['all', ['in', 'deltaTime', dt]],
                } as ILayer;
              }) as Array<ILayer>;
            } else {
              sources.push({
                id: data._id,
                source: data as FeatureCollection,
                dts: uniqueDTs as Array<number>,
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
                      'line-width': 6,
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
    // ASSISTANCE message
    this.socket.on('sas_message', (data: IAssistanceMessage) => {
      // This is the alert message for this particular FR
      console.log(data);
      M.toast({ html: 'New Alert Message!' });
    });    
    // Chat message
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
    // Added to a group
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
      M.toast({ html: 'Added to a new group' });
    });
    // These positions are received directly from the agent-smith simulator
    // These are therefore NOT assistance resources, but 'just' simEntities
    /*this.socket.on('positions', (data: FeatureCollection) => {
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
    });*/
    // CAP Alert
    this.socket.on('alert', (data: IAlert) => {
      const alertArea = (data.info as IInfo).area as IArea[];

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
       M.toast({ html: 'New Alert' });
    });    
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

  serverPopulator(feature: Feature): Promise<FeatureCollection> {
    return new Promise((resolve) => {
      this.socket.emit('client-pop', {feature}, (result: string) => {
        resolve(JSON.parse(result) as FeatureCollection)
      });
    })
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
