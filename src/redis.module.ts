import { DynamicModule, Global, Module } from '@nestjs/common';
import { RedisModuleAsyncOption, RedisModuleOptions } from './redis.interface';
import { RedisModuleDefinition } from './redis.module-definition';
import {
  RedisClientsProvider,
  createAsyncClientOptionProvider,
  createClientOptionProvider,
  createClientProvider,
} from './redis.providers';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [RedisService, RedisClientsProvider],
  exports: [RedisService, RedisClientsProvider],
})
export class RedisModule extends RedisModuleDefinition {
  static register(options: RedisModuleOptions): DynamicModule {
    const module = super.register(options);

    const optionProviders = options.map((opt) =>
      createClientOptionProvider(opt.id)
    );
    const providers = options.map((opt) => createClientProvider(opt.id));

    module.providers = [
      ...(module.providers ?? []),
      ...providers,
      ...optionProviders,
    ];
    module.exports = [...(module.exports ?? []), ...providers];

    return module;
  }

  static registerAsync(...options: RedisModuleAsyncOption[]): DynamicModule {
    const module = super.registerAsync(options);

    const optionProviders = options.map(
      createAsyncClientOptionProvider
    ) as any[];
    const providers = options.map((opt) =>
      createClientProvider(opt.id)
    ) as any[];

    module.providers = [
      ...(module.providers ?? []),
      ...providers,
      ...optionProviders,
    ];
    module.exports = [...(module.exports ?? []), ...providers];

    return module;
  }
}
