import { Controller, Post, Get, Body, Param, Res, HttpStatus } from '@nestjs/common';
import { ExportService } from './export.service';
import { Response } from 'express';
import { ApiProperty } from '@nestjs/swagger';

export class ExportLogsDto {
  @ApiProperty({
    example: '2026-07-01',
    description: 'The start date for the log export',
  })
  startDate: string;

  @ApiProperty({
    example: '2026-07-24',
    description: 'The end date for the log export',
  })
  endDate: string;
}

@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Post('logs')
  async exportLogs(@Body() body: ExportLogsDto, @Res() res: Response) {
    const startDate = body?.startDate;
    const endDate = body?.endDate;
    const data = await this.exportService.createJob(startDate, endDate);

    return res.status(HttpStatus.ACCEPTED).json({
      success: true,
      message: 'The job was successfully sent to RabbitMQ.',
      data,
    });
  }

  @Get('status/:jobId')
  async getStatus(@Param('jobId') jobId: string) {
    const data = await this.exportService.getJobStatus(jobId);
    return {
      success: true,
      message: 'Job status retrieved successfully.',
      data,
    };
  }
}
