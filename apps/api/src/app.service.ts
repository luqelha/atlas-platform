import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      message: '🌍 Welcome to Atlas Platform API!',
      status: 'healthy',
      version: '1.0.0',
    };
  }
}
