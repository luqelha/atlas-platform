import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response, Request } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaClientExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = exception.message.replace(/\n/g, '');

    switch (exception.code) {
      case 'P2002':
        status = HttpStatus.CONFLICT;
        const target = exception.meta?.target ? ` (${exception.meta.target})` : '';
        message = `Unique constraint failed${target}`;
        break;
      case 'P2025':
        status = HttpStatus.NOT_FOUND;
        message = 'Record not found';
        break;
      case 'P2003':
        status = HttpStatus.BAD_REQUEST;
        const field = exception.meta?.field_name ? ` (${exception.meta.field_name})` : '';
        message = `Foreign key constraint failed${field}`;
        break;
      default:
        // default 500 status code
        break;
    }

    this.logger.error(
      `[${request.method}] ${request.url} - Prisma Error ${exception.code}: ${message}`,
      exception.stack,
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    });
  }
}
