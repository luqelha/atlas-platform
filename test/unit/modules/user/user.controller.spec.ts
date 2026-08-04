import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../../../src/modules/user/user.controller';
import { UserService } from '../../../../src/modules/user/user.service';

const mockUserService = {
  create: jest.fn(),
  findAll: jest.fn(),
  getProfile: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const dto = { email: 'test@example.com', password: 'password123' };
      mockUserService.create.mockResolvedValueOnce({ id: '1', ...dto });

      const result = await controller.create(dto);
      expect(result).toEqual({ id: '1', ...dto });
      expect(mockUserService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [{ id: '1', email: 'test@example.com' }];
      mockUserService.findAll.mockResolvedValueOnce(users);

      const result = await controller.findAll();
      expect(result).toEqual(users);
    });
  });

  describe('getProfile', () => {
    it('should return a user profile', async () => {
      const user = { id: '1', email: 'test@example.com' };
      mockUserService.getProfile.mockResolvedValueOnce(user);

      const result = await controller.getProfile('1');
      expect(result).toEqual(user);
      expect(mockUserService.getProfile).toHaveBeenCalledWith('1');
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const user = { id: '1', email: 'test@example.com' };
      mockUserService.findOne.mockResolvedValueOnce(user);

      const result = await controller.findOne('1');
      expect(result).toEqual(user);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const dto = { email: 'new@example.com' };
      mockUserService.update.mockResolvedValueOnce({ id: '1', ...dto });

      const result = await controller.update('1', dto);
      expect(result).toEqual({ id: '1', ...dto });
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      mockUserService.remove.mockResolvedValueOnce({ id: '1' });

      const result = await controller.remove('1');
      expect(result).toEqual({ id: '1' });
    });
  });
});
