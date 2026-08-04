import { Test, TestingModule } from '@nestjs/testing';
import { MediaService } from '../../../../src/modules/media/media.service';
import { PrismaService } from '../../../../src/database/prisma.service';

const mockPrismaService = {};

describe('MediaService', () => {
  let service: MediaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediaService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<MediaService>(MediaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
