import { Injectable, Inject } from '@nestjs/common';
import {
  TestBedAdapter,
  Logger,
  LogLevel,
  IAdapterMessage,
  ProduceRequest,
} from 'node-test-bed-adapter';
import { DefaultWebSocketGateway } from '../gateway/default-websocket.gateway';
import { FeatureCollection } from 'geojson';
import { IAlert, IAssistanceMessage, IAssistanceResource, ICbrnFeatureCollection, IContext, IMission, ISensor } from '../../../shared/src';

interface ISendResponse {
  [topic: string]: {
    [partition: number]: number;
  };
}

const SimEntityFeatureCollectionTopic = 'simulation_entity_featurecollection';
const capMessage = 'standard_cap';
const contextTopic = 'context';
const resourceTopic = 'resource';
const missionTopic = 'mission';
const sensorTopic = 'sensor';
const messageTopic = 'message_incoming';
const chemicalIncidentTopic = 'chemical_incident';
const plumeTopic = 'cbrn_geojson';
const log = Logger.instance;

@Injectable()
export class KafkaService {
  public adapter: TestBedAdapter;
  public messageQueue: IAdapterMessage[] = [];
  public busy = false;

  constructor(@Inject(DefaultWebSocketGateway) private readonly socket: DefaultWebSocketGateway) {
    this.createAdapter().catch((e) => {
      log.error(e);
    });
  }

  public createAdapter(): Promise<TestBedAdapter> {
    return new Promise(async (resolve) => {
      log.info('Init KafkaService');
      this.adapter = new TestBedAdapter({
        clientId: 'c2app-server',
        kafkaHost: process.env.KAFKA_HOST || 'localhost:3501',
        schemaRegistry: process.env.SCHEMA_REGISTRY || 'localhost:3502',
        consume: [{ topic: SimEntityFeatureCollectionTopic }, { topic: capMessage }, { topic: contextTopic }, { topic: missionTopic }, { topic: resourceTopic }, { topic: sensorTopic }, { topic: chemicalIncidentTopic }, { topic: plumeTopic }, { topic: messageTopic }],
        logging: {
          logToConsole: LogLevel.Info,
          logToKafka: LogLevel.Warn,
        },
      });
      this.adapter.on('error', (_e) => {
        // On error, try to connect again
        this.adapter.connect().catch((e) => {
          log.error(e);
        });
      });
      this.adapter.on('message', (message: IAdapterMessage) => {
        this.messageQueue.push(message);
        this.handleMessage();
      });
      this.adapter.on('ready', () => {
        log.info('Kafka is connected');
        resolve(this.adapter);
      });
      this.adapter.connect().catch((e) => {
        log.error(e);
      });
    });
  }

  public send(payloads: ProduceRequest | ProduceRequest[], cb: (error?: any, data?: ISendResponse) => any): any {
    if (this.adapter.isConnected) {
      this.adapter.send(payloads, cb);
    } else {
      log.warn('Test-bed not connected');
      cb(null, {});
    }
  }

  private async handleMessage() {
    if (this.messageQueue.length > 0 && !this.busy) {
      this.busy = true;
      const message = this.messageQueue.shift();

      switch (message.topic) {
        case SimEntityFeatureCollectionTopic:
          this.socket.server.emit('positions', KafkaService.preparePositions(message.value as FeatureCollection));
          break;
        case capMessage:
          this.socket.server.emit('alert', message.value as IAlert);
          break;
        case contextTopic:
          this.socket.server.emit('context', message.value as IContext);
          break;
        case missionTopic:
          this.socket.server.emit('mission', message.value as IMission);
          break;
        case resourceTopic:
          this.socket.server.emit('resource', message.value as IAssistanceResource);
          break;
        case sensorTopic:
          this.socket.server.emit('sensor', message.value as ISensor);
          break;
        case chemicalIncidentTopic:
          this.socket.server.emit('chemical_incident', message.value as ISensor);
          break;
        case plumeTopic:
          this.socket.server.emit('plume', KafkaService.preparePlume(message.value as ICbrnFeatureCollection));
          break;
        case messageTopic:
          if(this.socket.callsignToSocketId.get((message.value as IAssistanceMessage).resource)) {
            this.socket.server
            .to(this.socket.callsignToSocketId.get((message.value as IAssistanceMessage).resource))
            .emit('sas_message', message.value as IAssistanceMessage);
          }
          else {
            console.log('Alert for ID: ' + (message.value as IAssistanceMessage).resource + ', resource not logged in!');
          }
          break;
        default:
          log.warn('Unknown topic');
          break;
      }
    }
    this.busy = false;
  }

  private static preparePositions(collection: FeatureCollection) {
    for (const feature of collection.features) {
      feature.geometry = feature.geometry['eu.driver.model.sim.support.geojson.geometry.Point'];
    }
    return collection as FeatureCollection;
  }
  private static preparePlume(collection: ICbrnFeatureCollection) {
    for (const feature of collection.features) {
      if(feature.geometry[`nl.tno.assistance.geojson.geometry.Point`]) {
        feature.geometry = feature.geometry[`nl.tno.assistance.geojson.geometry.Point`];
      }
      else if(feature.geometry[`nl.tno.assistance.geojson.geometry.MultiPoint`]) {
        feature.geometry = feature.geometry[`nl.tno.assistance.geojson.geometry.MultiPoint`];
      }
      else if (feature.geometry[`nl.tno.assistance.geojson.geometry.LineString`]) {
        feature.geometry = feature.geometry[`nl.tno.assistance.geojson.geometry.LineString`];
      }
      else if (feature.geometry[`nl.tno.assistance.geojson.geometry.MultiLineString`]) {
        feature.geometry = feature.geometry[`nl.tno.assistance.geojson.geometry.MultiLineString`];
      }
      else if(feature.geometry[`nl.tno.assistance.geojson.geometry.Polygon`]){
        feature.geometry = feature.geometry[`nl.tno.assistance.geojson.geometry.Polygon`];
      }
      else if (feature.geometry[`nl.tno.assistance.geojson.geometry.MultiPolygon`]) {
        feature.geometry = feature.geometry[`nl.tno.assistance.geojson.geometry.MultiPolygon`];
      }
    }
    return collection as ICbrnFeatureCollection;
  }
}
