import { Inject, Injectable, LogLevel, Logger } from '@nestjs/common';
import { DEFAULT_LOG_LEVELS } from './redis.constants';
import { InjectRedisClients } from './redis.decorator';
import {
  RedisClient,
  RedisClientID,
  RedisClientOptions,
  RedisEvent,
  RedisModuleOptions,
} from './redis.interface';
import { REDIS_MODULE_OPTIONS } from './redis.module-definition';
import { idStr, logLevel } from './utils';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);

  constructor(
    @InjectRedisClients()
    private readonly clients: Map<RedisClientID, RedisClient>,
    @Inject(REDIS_MODULE_OPTIONS) private readonly options: RedisModuleOptions,
  ) {}

  getClients(): Map<RedisClientID, RedisClient> {
    return this.clients;
  }

  getClient(id: RedisClientID): RedisClient {
    const client = this.clients.get(id);
    if (!client) throw new Error(`Client not found : ${idStr(id)}`);
    return client;
  }

  private getOptions(id: RedisClientID): RedisClientOptions {
    const config = this.options.find((opt) => opt.id === id);
    if (!config)
      throw new Error(`Redis client config not found for id : ${idStr(id)}`);
    return config;
  }

  private getLogOptions(id: RedisClientID) {
    let options = this.getOptions(id).log;
    let levels: Record<RedisEvent, LogLevel | false> = DEFAULT_LOG_LEVELS;
    options = options ?? ['ready', 'error'];

    // Set levels
    if (Array.isArray(options)) {
      for (const event in DEFAULT_LOG_LEVELS) {
        const e = event as RedisEvent;
        levels = {
          ...levels,
          [event]: options.includes(e) ? DEFAULT_LOG_LEVELS[e] : false,
        };
      }
    } else {
      for (const event in DEFAULT_LOG_LEVELS) {
        const e = event as RedisEvent;
        const level = options[e];
        levels = {
          ...levels,
          [event]: logLevel(e, level),
        };
      }
    }

    return levels;
  }

  private attachListeners(id: RedisClientID) {
    const client = this.getClient(id);
    const log = this.getLogOptions(id);

    // Connect event
    if (log.connect) {
      const level = log.connect;
      client.on('connect', () =>
        this.logger[level](`Connecting to ${idStr(id)}`),
      );
    }

    // Ready event
    if (log.ready) {
      const level = log.ready;
      client.on('ready', () =>
        this.logger[level](`Redis client is ready : ${idStr(id)}`),
      );
    }

    // End event
    if (log.end) {
      const level = log.end;
      client.on('end', () =>
        this.logger[level](`Connection closed : ${idStr(id)}`),
      );
    }

    // reconnecting event
    if (log.reconnecting) {
      const level = log.reconnecting;
      client.on('reconnecting', () =>
        this.logger[level](`Reconnecting : ${idStr(id)}`),
      );
    }

    // Error event
    if (log.error) {
      const level = log.error;
      client.on('error', (error: Error) =>
        this.logger[level](`[${idStr(id)}] : ${error.message}`),
      );
    }
  }
}
