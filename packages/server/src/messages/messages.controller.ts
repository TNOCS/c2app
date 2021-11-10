import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('/:topic')
  create(@Param('topic') topic: string, @Body() msg: CreateMessageDto) {
    return this.messagesService.create(topic, msg);
  }

  @Get('/:topic')
  findAll(@Param('topic') topic: string) {
    // console.log(`Get messages in topic ${topic}`);
    return this.messagesService.findAll(topic);
  }

  @Get('/:topic/:id')
  findOne(@Param('topic') topic: string, @Param('id') query: string | number | { [key: string]: any }) {
    // console.log(`Get message with id ${query} in topic ${topic}`);
    return this.messagesService.findOne(topic, query);
  }

  @Patch('/:topic/:id')
  update(@Param('topic') topic: string, @Param('id') id: string, @Body() msg: UpdateMessageDto) {
    return this.messagesService.update(topic, +id, msg);
  }

  @Delete('/:topic/:id')
  remove(@Param('topic') topic: string, @Param('id') id: string) {
    // console.log(`Removing messages/${topic}/${id}`);
    return this.messagesService.remove(topic, +id);
  }
}
