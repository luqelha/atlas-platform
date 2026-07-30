export class CreateAuditLogDto {
  tenantId?: string;
  userId?: string;
  action: string;
  entity?: string;
  entityId?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
}
