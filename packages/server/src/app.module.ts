import { HttpModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { KafkaService } from './services/kafka.service';
import { DefaultWebSocketGateway } from './gateway/default-websocket.gateway';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [DefaultWebSocketGateway, KafkaService],
})
export class AppModule {}
