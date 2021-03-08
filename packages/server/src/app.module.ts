import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { KafkaService } from './services/kafka.service';
import { DefaultWebSocketGateway } from './gateway/default-websocket.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [KafkaService, DefaultWebSocketGateway],
})
export class AppModule {}
