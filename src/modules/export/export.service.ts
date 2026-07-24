import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { createClient, RedisClientType } from 'redis';
import { v4 as uuidv4 } from 'uuid';

export enum JobStatus {
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
}

@Injectable()
export class ExportService {
  private redisClient: RedisClientType;

  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly rabbitClient: ClientProxy,
  ) {
    this.redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });
    this.redisClient.connect().catch(console.error);
  }

  async createJob(startDate: string, endDate: string) {
    const jobId = uuidv4();
    
    await this.redisClient.set(
      jobId,
      JSON.stringify({
        status: JobStatus.PENDING,
        progress: 0,
        createdAt: new Date(),
      }),
      { EX: 86400 } // 24 hours
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
    const statusStr = await this.redisClient.get(jobId);
    if (!statusStr) {
      throw new NotFoundException('Job not found!');
    }
    return JSON.parse(statusStr as string);
  }
}

