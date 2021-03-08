import { Injectable, Inject } from '@nestjs/common';
import { TestBedAdapter, Logger, LogLevel, IAdapterMessage, ProduceRequest } from 'node-test-bed-adapter';
import { DefaultWebSocketGateway } from '../gateway/defaultWebSocket.gateway';
import { FeatureCollection } from 'geojson';

interface ISendResponse {
  [topic: string]: {
    [partition: number]: number;
  };
}

const SimEntityFeatureCollectionTopic = 'simulation_entity_featurecollection';
const log = Logger.instance;

@Injectable()
export class KafkaService {
  public adapter: TestBedAdapter;
  public messageQueue: IAdapterMessage[] = [];
  public busy = false;

  constructor(@Inject('DefaultWebSocketGateway') private readonly socket: DefaultWebSocketGateway) {
    log.info('Init KafkaService');
    this.adapter = new TestBedAdapter({
      clientId: 'c2app-server',
      kafkaHost: process.env.KAFKA_HOST || 'localhost:3501',
      schemaRegistry: process.env.SCHEMA_REGISTRY || 'localhost:3502',
      //autoRegisterSchemas: true,
      //schemaFolder: path.resolve(`../../docker/schemas`),
      //produce: ['chemical_hazard', 'cbrn_geojson'],
      consume: [{ topic: SimEntityFeatureCollectionTopic }],
      logging: {
        logToConsole: LogLevel.Info,
        logToKafka: LogLevel.Warn,
      },
    });
    this.adapter.on('error', (e) => console.error(e));
    this.adapter.on('message', (message: IAdapterMessage) => {
      this.messageQueue.push(message);
      this.handleMessage();
    });
    this.adapter.on('ready', () => {
      log.info('Kafka is connected');
    });
    this.adapter.connect();
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
          this.socket.server.emit('positions', this.prepareGeoJSONLayer(message.value as FeatureCollection));
          break;
        default:
          log.warn('Unknown topic');
          break;
      }
    }
    this.busy = false;
  }

  private prepareGeoJSONLayer(collection: FeatureCollection) {
    for (const feature of collection.features) {
      feature.geometry = feature.geometry['eu.driver.model.sim.support.geojson.geometry.Point'];
    }
    return collection as FeatureCollection;
  }
}
