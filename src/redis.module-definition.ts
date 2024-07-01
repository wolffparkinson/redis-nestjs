import { ConfigurableModuleBuilder } from '@nestjs/common';

const definition = new ConfigurableModuleBuilder<any>().build();

export const REDIS_MODULE_OPTIONS = definition.MODULE_OPTIONS_TOKEN;
export class RedisModuleDefinition extends definition.ConfigurableModuleClass {}
