import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { AuditService } from '../../modules/audit/audit.service';
import { TRACK_ACTIVITY_KEY, TrackActivityOptions } from '../decorators/track-activity.decorator';

@Injectable()
export class ActivityTrackingInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly auditService: AuditService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const trackOptions = this.reflector.get<TrackActivityOptions>(
      TRACK_ACTIVITY_KEY,
      context.getHandler(),
    );

    // If no decorator is present, proceed without tracking
    if (!trackOptions) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap((data) => {
        const { action, entity } = trackOptions;

        const tenantId = request.tenant?.id || request.tenantId;
        const userId = request.user?.id || request.user?.userId || request.user?.sub;

        const ipAddress = request.ip || request.connection?.remoteAddress;
        const userAgent = request.headers['user-agent'];

        // Determine if there is an entityId in params or response data
        let entityId: string | undefined;
        if (data && data.id) {
          entityId = data.id;
        } else if (request.params && request.params.id) {
          entityId = request.params.id;
        }

        // We run the audit logging asynchronously so it doesn't block the request
        this.auditService
          .logActivity({
            tenantId,
            userId,
            action,
            entity,
            entityId,
            details: request.body, // or you can pick what details you want
            ipAddress,
            userAgent,
          })
          .catch((err) => {
            console.error('Failed to log activity in ActivityTrackingInterceptor', err);
          });
      }),
    );
  }
}
