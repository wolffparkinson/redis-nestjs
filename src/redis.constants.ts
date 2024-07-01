import type { LogLevel } from '@nestjs/common';
import type { RedisClientOptions, RedisEvent } from './redis.interface';

/**
 * Token for providing configurations of all clients
 */
export const REDIS_CLIENT_CONFIGS = Symbol('REDFIS_CLIENT_CONFIGS');

/**
 * Token for providing all Redis clients
 */
export const REDIS_CLIENTS = Symbol('REDIS_CLIENTS');

/**
 * Token for providing default Redis client
 */
export const DEFAULT_CLIENT_ID = 'default_client';

/**
 * Redis client token prefix
 */
export const REDIS_CLIENT_PREFIX = 'RedisClient';

/**
 * Redis client options token prefix
 */
export const REDIS_CLIENT_OPTION_PREFIX = 'RedisClientOption';

/**
 * Default log levels
 */
export const DEFAULT_LOG_LEVELS = {
  connect: 'debug',
  ready: 'debug',
  reconnecting: 'debug',
  error: 'error',
  end: 'debug',
} satisfies Record<RedisEvent, LogLevel>;

/**
 * Default log options
 */
export const DEFAULT_LOG_OPTIONS: RedisClientOptions['log'] = [
  'ready',
  'error',
];
