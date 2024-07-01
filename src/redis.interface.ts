import type { ConfigurableModuleAsyncOptions, LogLevel } from '@nestjs/common';
import type { RedisClientOptions as RedisOptions, createClient } from 'redis';

export interface RedisEvents {
  /**
   * Initiating a connection to the server
   */
  connect: () => void;

  /**
   * Client is ready to use
   */
  ready: () => void;

  /**
   * Connection has been closed (via `.quit()` or `.disconnect()`)
   */
  end: () => void;

  /**
   * An error has occurred—usually a network issue such as "Socket closed unexpectedly"
   */
  error: (error: Error) => void;

  /**
   * Client is trying to reconnect to the server
   */
  reconnecting: () => void;
}

export type RedisEvent = keyof RedisEvents;

export type RedisClient = ReturnType<typeof createClient>;

export type RedisClientID = string | number | symbol;

export type RedisClientOptions = RedisOptions & {
  id?: RedisClientID;
  log?:
    | RedisEvent[]
    | {
        [E in RedisEvent]?: boolean | LogLevel;
      };
};

export type RedisModuleOptions = RedisClientOptions[];
export type RedisModuleAsyncOption = ConfigurableModuleAsyncOptions<
  Omit<RedisClientOptions, 'id'>
> & { id?: RedisClientID };
