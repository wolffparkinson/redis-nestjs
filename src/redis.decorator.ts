import { Inject } from '@nestjs/common';
import { DEFAULT_CLIENT_ID, REDIS_CLIENTS } from './redis.constants';
import type { RedisClientID } from './redis.interface';
import { getClientToken } from './utils';

/**
 * Injects Redis client instance with the given ID
 * @param name client id
 */
export function InjectRedis(id?: RedisClientID): ParameterDecorator {
  const clientId = id ?? DEFAULT_CLIENT_ID;
  const token = getClientToken(clientId);
  return Inject(token);
}

/**
 * Injects all redis client instances
 */
export function InjectRedisClients(): ParameterDecorator {
  return Inject(REDIS_CLIENTS);
}
