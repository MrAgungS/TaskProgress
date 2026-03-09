import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/common/redis/redis.service';

// Used to invalidate tokens on logout before they naturally expire.
@Injectable()
export class JwtBlacklistService {
  constructor(
    private redisService: RedisService,
    private readonly jwt: JwtService,
  ) {}

  // Adds a token to the blacklist with an expiry matching the token's own expiry.
  // This ensures the blacklist entry is automatically cleaned up when the token expires.
  async blackListToken(token: string): Promise<void> {
    const decoded = this.jwt.decode<{ exp: number }>(token);
    const now = Math.floor(Date.now() / 1000);
    const ttl = decoded.exp - now;

    if (ttl > 0) {
      await this.redisService.set(`blacklist:${token}`, '1', ttl);
    }
  }

  // Checks whether a given token is blacklisted.
  // Returns true if the token is found in Redis (i.e. has been revoked).
  async IsBlackListed(token: string): Promise<boolean> {
    const result = await this.redisService.get(`blacklist:${token}`);
    return result !== null;
  }
}
