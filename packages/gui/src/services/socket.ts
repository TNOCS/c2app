import { /*Feature,*/ FeatureCollection } from 'geojson';
import { SourceType, IAppModel, Icon, ILayer, ISource, UpdateStream } from './meiosis';
import io from 'socket.io-client';
import {
  IAlert/*, IArea*/,
  IGroup,/* IInfo,*/
  IMessage,
  IChemicalHazard,
  IAssistanceResource, ISensor,
} from '../../../shared/src';
import M from 'materialize-css';
import mapboxgl from 'mapbox-gl';
import m from 'mithril';

export class Socket {
  private socket: SocketIOClient.Socket;

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
                  layers: [{
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
                  }] as ILayer[],
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
      us({
        app: {
          resourceDict: (resources: { [id: string]: IAssistanceResource }) => {
            resources[data._id] = data;
            return resources;
          },
          /*sources: (sources: ISource[]) => {
            const index = sources.findIndex((source: ISource) => {
              return source.sourceName === 'Resources';
            });

            if (index > -1) {

              const fc = {
                type: 'FeatureCollection',
                features: features,
              } as FeatureCollection;

              sources[index].source = fc;
            } else {
              const fc = {
                type: 'FeatureCollection',
                features: features,
              } as FeatureCollection;
            }
            return sources;
          },*/
        },
      });
    });
    this.socket.on('sensor', (data: ISensor) => {
      us({
        app: {
          sensorDict: (sensors: { [id: string]: ISensor }) => {
            sensors[data._id] = data;
            return sensors;
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

  serverCHT(hazard: Partial<IChemicalHazard>): Promise<FeatureCollection> {
    return new Promise((resolve) => {
      this.socket.emit('client-cht', { hazard: hazard }, (result: string) => {
        resolve(JSON.parse(result));
      });
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
