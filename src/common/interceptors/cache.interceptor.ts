import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RedisService } from '../../modules/redis/redis.service';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CacheInterceptor.name);

  constructor(private readonly redisService: RedisService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const tenantId = request.headers['x-tenant-id'];

    // Only cache GET requests
    if (request.method !== 'GET') {
      return next.handle();
    }

    // Construct cache key with tenant isolation
    const cacheKey = `cache:${tenantId || 'global'}:${request.originalUrl}`;

    try {
      const cachedResponse = await this.redisService.get(cacheKey);
      if (cachedResponse) {
        this.logger.debug(`Cache hit: ${cacheKey}`);
        return of(JSON.parse(cachedResponse));
      }
    } catch (error) {
      this.logger.warn(`Redis get error: ${error.message}`);
    }

    this.logger.debug(`Cache miss: ${cacheKey}`);
    return next.handle().pipe(
      tap(async (response) => {
        try {
          // Cache for 60 seconds
          await this.redisService.set(cacheKey, JSON.stringify(response), { EX: 60 });
        } catch (error) {
          this.logger.warn(`Redis set error: ${error.message}`);
        }
      }),
    );
  }
}
