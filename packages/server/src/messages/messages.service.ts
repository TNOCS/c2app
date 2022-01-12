import { existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { cwd } from 'process';
import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import * as loki from 'lokijs';
import { Collection } from 'lokijs';
import * as lfsa from 'lokijs/src/loki-fs-structured-adapter';
import { sortByDateDesc } from '../utils';

const dbName = process.env.DB || 'db/safr.db';

@Injectable()
export class MessagesService {
  private db: loki;
  private messageTopicStore = {} as { [topic: string]: Collection };

  constructor() {
    const folderPath = dirname(resolve(cwd(), dbName));
    if (!existsSync(folderPath)) mkdirSync(folderPath, { recursive: true });

    const autoloadCallback = () => {
      if (this.db.collections && this.db.collections.length > 0) {
        this.db.collections.forEach((c) => {
          this.messageTopicStore[c.name] = this.db.getCollection(c.name);
          console.log(`Number of entries in collection '${c.name}': ${c.count()}`);
        });
      }
      console.log(`Storing all messages in ${dbName}.`);
    };

    this.db = new loki(dbName, {
      adapter: new lfsa(),
      autoload: true,
      autoloadCallback,
      autosave: true,
      throttledSaves: true,
    } as Partial<LokiConfigOptions>);
  }

  create(topic: string, message: CreateMessageDto) {
    if (!this.messageTopicStore.hasOwnProperty(topic)) {
      this.messageTopicStore[topic] = this.db.addCollection(topic);
    }
    return this.messageTopicStore[topic].insert(message);
    // return 'This action adds a new message';
  }

  findAll(topic: string, query?: string) {
    if (!this.messageTopicStore.hasOwnProperty(topic)) {
      return [];
    }
    const collection = this.messageTopicStore[topic];
    const q = query
      ? (JSON.parse(query) as { [prop: string]: string | number | { [ops: string]: string | number } })
      : undefined;
    return q ? collection.chain().find(q).sort(sortByDateDesc).data() : collection.chain().sort(sortByDateDesc).data();
    // return `This action returns all messages`;
  }

  findOne(topic: string, query: string | number | { [key: string]: any }): LokiObj | false {
    if (!this.messageTopicStore.hasOwnProperty(topic)) {
      return false;
    }
    const collection = this.messageTopicStore[topic];
    if (typeof query === 'number') {
      return collection.get(query);
    }
    if (typeof query === 'string') {
      const q = query
        ? (JSON.parse(query) as { [prop: string]: string | number | { [ops: string]: string | number } })
        : undefined;
      return q ? collection.findOne(q) : undefined;
    }
    return collection.findOne(query);
    // return `This action returns a #${query} message`;
  }

  update(topic: string, id: number, msg: UpdateMessageDto): LokiObj | false {
    if (!this.messageTopicStore.hasOwnProperty(topic)) {
      return false;
    }
    return this.messageTopicStore[topic].update(msg);
    // return `This action updates a #${id} message`;
  }

  remove(topic: string, id: number) {
    if (!this.messageTopicStore.hasOwnProperty(topic)) {
      return false;
    }
    const item = this.messageTopicStore[topic].get(id);
    return item ? this.messageTopicStore[topic].remove(item) : false;
    // return `This action removes a #${id} message`;
  }
}
