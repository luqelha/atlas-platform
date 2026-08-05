import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Res,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { ExportService } from './export.service';
import { Response } from 'express';
import { ApiProperty } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';

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

  @Get('download/:jobId')
  async download(@Param('jobId') jobId: string, @Res() res: Response) {
    const exportPath = path.join(process.cwd(), 'storage', 'exports');
    const zipName = `export-${jobId}.zip`;
    const filePath = path.join(exportPath, zipName);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Export file not found or has expired.');
    }

    res.download(filePath, zipName, (err) => {
      if (err && !res.headersSent) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: 'Could not download the file.',
        });
      }
    });
  }
}
