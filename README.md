# redis-nestjs

## Table of contents

- [Installation](#installation)
- [Usage](#usage)

## Installation

```sh
# via npm
npm install redis-nestjs redis

# using yarn
yarn add redis-nestjs redis

# using pnpm
pnpm add redis-nestjs redis
```

## Usage

```ts
import { Module } from '@nestjs/common';
import { RedisModule } from 'redis-nestjs';

@Module({
  imports: [
    RedisModule.register(
      { url: 'redis://localhost:6379' },
      { id: 1, database: 1, url: 'redis://localhost:6379' },
    ),
  ],
})
export class AppModule {}
```
