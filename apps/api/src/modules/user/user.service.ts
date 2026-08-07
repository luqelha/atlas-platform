import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
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

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        passwordHash: hashedPassword,
      },
    });

    const { passwordHash, refreshToken, ...result } = user;
    return result;
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map((user) => {
      const { passwordHash, refreshToken, ...result } = user;
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

    const { passwordHash, refreshToken, ...result } = user;
    return result;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    const data: any = { ...updateUserDto };
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      data.passwordHash = await bcrypt.hash(updateUserDto.password, salt);
      data.refreshToken = null; // Invalidate refresh token on password change
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

    const { passwordHash, refreshToken, ...result } = user;
    return result;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: `User with ID ${id} deleted successfully` };
  }

  async getProfile(id: string) {
    return this.findOne(id);
  }

  async findByEmailForAuth(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByIdForAuth(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async updateRefreshToken(id: string, refreshToken: string | null) {
    let refreshTokenHash = null;
    if (refreshToken) {
      const salt = await bcrypt.genSalt();
      refreshTokenHash = await bcrypt.hash(refreshToken, salt);
    }
    await this.prisma.user.update({
      where: { id },
      data: { refreshToken: refreshTokenHash },
    });
  }
}
