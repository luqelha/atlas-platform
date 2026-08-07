import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RedisService } from '../redis/redis.service';
import { v4 as uuidv4 } from 'uuid';

export enum JobStatus {
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
}

@Injectable()
export class ExportService {
  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly rabbitClient: ClientProxy,
    private readonly redisService: RedisService,
  ) {}

  async createJob(startDate: string, endDate: string) {
    const jobId = uuidv4();

    await this.redisService.set(
      jobId,
      JSON.stringify({
        status: JobStatus.PENDING,
        progress: 0,
        createdAt: new Date(),
      }),
      { EX: 86400 },
    );

    const job = {
      jobId,
      startDate,
      endDate,
      createdAt: new Date().toISOString(),
      status: JobStatus.PENDING,
    };

    // emit sends without waiting for a response, matching fire-and-forget
    this.rabbitClient.emit('export_logs', job);

    return { jobId, status: JobStatus.PENDING };
  }

  async getJobStatus(jobId: string) {
    const statusStr = await this.redisService.get(jobId);
    if (!statusStr) {
      throw new NotFoundException('Job not found!');
    }
    return JSON.parse(statusStr as string);
  }
}
