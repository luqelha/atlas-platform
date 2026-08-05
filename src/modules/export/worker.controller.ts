import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CompressionService } from './compression.service';
import { RedisService } from '../redis/redis.service';
import { JobStatus } from './export.service';

@Controller('worker')
export class WorkerController {
  private readonly logger = new Logger(WorkerController.name);
  constructor(
    private readonly compressionService: CompressionService,
    private readonly redisService: RedisService,
  ) {}

  @EventPattern('export_logs')
  async handleLogExport(@Payload() data: any) {
    const { jobId } = data;
    this.logger.log(`Processing Job: ${jobId}`);

    try {
      await this.redisService.set(
        jobId,
        JSON.stringify({
          status: JobStatus.PROCESSING,
          progress: 20,
        }),
        { KEEPTTL: true },
      );

      const result = await this.compressionService.compressLogs(jobId);

      await this.redisService.set(
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
      await this.redisService.set(
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
