import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // Since this is Day 8 (before Auth in Day 9), we will just mock the password hash for now.
    // In Day 9, we'll hash the actual password using bcrypt/argon2.
    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        passwordHash: 'mock-hash-' + createUserDto.password, // TODO: Hash password on Day 9
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...result } = user;
    return result;
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...result } = user;
      return result;
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...result } = user;
    return result;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id); // Ensure user exists

    const data: any = { ...updateUserDto };
    if (updateUserDto.password) {
      data.passwordHash = 'mock-hash-' + updateUserDto.password; // TODO: Hash password on Day 9
      delete data.password;
    }

    if (updateUserDto.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Email already in use');
      }
    }

    const user = await this.prisma.user.update({
      where: { id },
      data,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...result } = user;
    return result;
  }

  async remove(id: string) {
    await this.findOne(id); // Ensure user exists

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: `User with ID ${id} deleted successfully` };
  }

  async getProfile(id: string) {
    // In Day 9, this will extract user ID from the JWT token in Request object
    return this.findOne(id);
  }
}
