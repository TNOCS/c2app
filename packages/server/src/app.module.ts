import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { KafkaService } from './services/kafka.service';
import { DefaultWebSocketGateway } from './gateway/default-websocket.gateway';
import { ConfigModule } from '@nestjs/config';
import { MessagesModule } from './messages/messages.module';
import { MessagesService } from './messages/messages.service';

@Module({
  imports: [HttpModule, ConfigModule.forRoot(), MessagesModule],
  controllers: [AppController],
  providers: [DefaultWebSocketGateway, KafkaService, MessagesService],
})
export class AppModule {}
