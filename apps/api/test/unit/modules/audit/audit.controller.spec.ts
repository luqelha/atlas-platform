import { Test, TestingModule } from '@nestjs/testing';
import { AuditController } from '../../../../src/modules/audit/audit.controller';
import { AuditService } from '../../../../src/modules/audit/audit.service';

import { JwtAuthGuard } from '../../../../src/modules/auth/guards/jwt-auth.guard';
import { RbacGuard } from '../../../../src/common/guards/rbac.guard';

const mockAuditService = {
  getAuditLogs: jest.fn(),
};

describe('AuditController', () => {
  let controller: AuditController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditController],
      providers: [
        {
          provide: AuditService,
          useValue: mockAuditService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RbacGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuditController>(AuditController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAuditLogs', () => {
    it('should get audit logs for a tenant', async () => {
      const mockResult = { data: [], meta: { total: 0 } };
      mockAuditService.getAuditLogs.mockResolvedValueOnce(mockResult);

      const tenant = { id: 'tenant-1' };
      const query = { page: 1, limit: 10 };

      const result = await controller.getAuditLogs(tenant, query);

      expect(result).toEqual(mockResult);
      expect(mockAuditService.getAuditLogs).toHaveBeenCalledWith('tenant-1', query);
    });
  });
});
