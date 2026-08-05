import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { createClient, RedisClientType, SetOptions } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    this.client.on('error', (err) => this.logger.error('Redis Client Error', err));
    this.client.on('connect', () => this.logger.log('Connected to Redis'));
  }

  async onModuleInit() {
    await this.client.connect();
  }

  async onModuleDestroy() {
    if (this.client.isOpen) {
      await this.client.disconnect();
    }
  }

  async get(key: string): Promise<string | null> {
    const value = await this.client.get(key);
    return value as string | null;
  }

  async set(key: string, value: string, options?: any): Promise<void> {
    await this.client.set(key, value, options);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  getClient(): RedisClientType {
    return this.client;
  }
}
