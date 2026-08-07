import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../../src/modules/user/user.service';
import { PrismaService } from '../../../../src/database/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a user', async () => {
      const dto = { email: 'test@test.com', password: 'password123' };
      const hashedPassword = 'hashedPassword';

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      mockPrismaService.user.create.mockResolvedValue({
        id: '1',
        email: dto.email,
        passwordHash: hashedPassword,
        refreshToken: null,
      });

      const result = await service.create(dto);

      expect(result).toEqual({ id: '1', email: dto.email });
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: dto.email,
          passwordHash: hashedPassword,
        },
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      const dto = { email: 'test@test.com', password: 'password123' };
      mockPrismaService.user.findUnique.mockResolvedValue({ id: '1' });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'test@test.com',
        passwordHash: 'hash',
        refreshToken: 'token',
      });

      const result = await service.findOne('1');

      expect(result).toEqual({ id: '1', email: 'test@test.com' });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });
});
