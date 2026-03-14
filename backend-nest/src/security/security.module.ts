import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerRedisStorage } from './storage/throttler-redis.storage';
import { JwtBlacklistService } from './services/jwt-blacklist.service';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { getRedisConnectionToken } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Global()
@Module({
  imports: [
    // Register JWT module with a shared secret and default token expiry
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
    // Configure throttler (rate limiter) with Redis as the backing storage
    ThrottlerModule.forRootAsync({
      inject: [getRedisConnectionToken()],
      useFactory: (redis: Redis) => ({
        throttlers: [
          { name: 'default', ttl: 60000, limit: 60 },
          { name: 'strict', ttl: 60000, limit: 5 },
        ],
        storage: new ThrottlerRedisStorage(redis),
      }),
    }),
  ],
  providers: [
    JwtStrategy,
    JwtRefreshStrategy,
    JwtBlacklistService,
    ThrottlerRedisStorage,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [JwtModule, JwtBlacklistService],
})
export class SecurityModule {}
