import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CompressionService } from './compression.service';
import { createClient, RedisClientType } from 'redis';
import { JobStatus } from './export.service';

@Controller('worker')
export class WorkerController {
  private readonly logger = new Logger(WorkerController.name);
  private redisClient: RedisClientType;

  constructor(private readonly compressionService: CompressionService) {
    this.redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });
    this.redisClient.connect().catch(console.error);
  }

  @EventPattern('export_logs')
  async handleLogExport(@Payload() data: any) {
    const { jobId } = data;
    this.logger.log(`Processing Job: ${jobId}`);

    try {
      await this.redisClient.set(
        jobId,
        JSON.stringify({
          status: JobStatus.PROCESSING,
          progress: 20,
        }),
        { KEEPTTL: true },
      );

      const result = await this.compressionService.compressLogs(jobId);

      await this.redisClient.set(
        jobId,
        JSON.stringify({
          status: JobStatus.COMPLETED,
          progress: 100,
          filename: result.zipName,
          completedAt: new Date(),
        }),
        { KEEPTTL: true },
      );

      this.logger.log(`ZIP created: ${result.zipName}`);
      this.logger.log(`Job ${jobId} completed successfully.`);
    } catch (error) {
      await this.redisClient.set(
        jobId,
        JSON.stringify({
          status: JobStatus.FAILED,
          progress: 0,
          error: error.message,
        }),
        { KEEPTTL: true },
      );
      this.logger.error(`Job ${jobId} failed: ${error.message}`);
    }
  }
}
