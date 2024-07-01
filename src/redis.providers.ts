import { Logger, Provider } from '@nestjs/common';
import { createClient } from 'redis';
import { DEFAULT_CLIENT_ID, REDIS_CLIENTS } from './redis.constants';
import {
  RedisClient,
  RedisClientID,
  RedisClientOptions,
  RedisModuleAsyncOption,
  RedisModuleOptions,
} from './redis.interface';
import { REDIS_MODULE_OPTIONS } from './redis.module-definition';
import {
  getClientOptionToken,
  getClientToken,
  getLogOptions,
  idStr,
} from './utils';

/**
 * All Redis client instances
 */
export const clients: Map<RedisClientID, RedisClient> = new Map<
  RedisClientID,
  RedisClient
>();

export function createClientOptionProvider(
  id: RedisClientID = DEFAULT_CLIENT_ID
): Provider<RedisClientOptions> {
  return {
    provide: getClientOptionToken(id),
    inject: [REDIS_MODULE_OPTIONS],
    useFactory(options: RedisModuleOptions) {
      const option = options.find((opt) => opt.id === id);
      if (!option) throw new Error(`Client config not found : ${idStr(id)}`);
      return option;
    },
  };
}

export function createAsyncClientOptionProvider(
  option: RedisModuleAsyncOption
) {
  return {
    provide: getClientOptionToken(option.id ?? DEFAULT_CLIENT_ID),
    ...option,
  };
}

const logger = new Logger('RedisModule');

export function createClientProvider(
  id: RedisClientID = DEFAULT_CLIENT_ID
): Provider<RedisClient> {
  return {
    provide: getClientToken(id),
    inject: [getClientOptionToken(id)],
    async useFactory(options: RedisClientOptions) {
      const id = options.id ?? DEFAULT_CLIENT_ID;
      let client = clients.get(id);
      if (!client) {
        client = createClient(options);
        const log = getLogOptions(options.log);

        // Ready event
        if (log.ready) {
          const level = log.ready;
          client.on('ready', () =>
            logger[level](`Redis client is ready : ${idStr(id)}`)
          );
        }

        // End event
        if (log.end) {
          const level = log.end;
          client.on('end', () =>
            logger[level](`Connection closed : ${idStr(id)}`)
          );
        }

        // reconnecting event
        if (log.reconnecting) {
          const level = log.reconnecting;
          client.on('reconnecting', () =>
            logger[level](`Reconnecting : ${idStr(id)}`)
          );
        }

        // Error event
        if (log.error) {
          const level = log.error;
          client.on('error', (error: Error) =>
            logger[level](`[${idStr(id)}] : ${error.message}`)
          );
        }
      }

      clients.set(id, client);
      if (!client.isReady) await client.connect();
      return client;
    },
  };
}

export const RedisClientsProvider: Provider<Map<RedisClientID, RedisClient>> = {
  provide: REDIS_CLIENTS,
  useValue: clients,
};
