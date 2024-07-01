import type { LogLevel } from '@nestjs/common';
import {
  DEFAULT_LOG_LEVELS,
  REDIS_CLIENT_OPTION_PREFIX,
  REDIS_CLIENT_PREFIX,
} from './redis.constants';
import type {
  RedisClientID,
  RedisClientOptions,
  RedisEvent,
} from './redis.interface';

/**
 * Transforms a RedisClientID to a string
 */
export function idStr(id: RedisClientID): string {
  if (typeof id === 'string') return id;
  return id.toString();
}

/**
 * Create a Redis client option token
 */
export function getClientOptionToken(id: RedisClientID) {
  if (typeof id === 'symbol') return id;
  return `__${REDIS_CLIENT_OPTION_PREFIX}:${id}__`;
}

/**
 * Create a Redis client token
 */
export function getClientToken(id: RedisClientID) {
  if (typeof id === 'symbol') return id;
  return `__${REDIS_CLIENT_PREFIX}:${id}__`;
}

export function logLevel(
  event: RedisEvent,
  level: LogLevel | boolean | undefined,
): LogLevel | false {
  switch (typeof level) {
    case 'boolean':
      if (level === false) return false;
      break;

    case 'string':
      return level;

    default:
      break;
  }

  return DEFAULT_LOG_LEVELS[event];
}

export function getLogOptions(options: RedisClientOptions['log']) {
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
