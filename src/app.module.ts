import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExportModule } from './modules/export/export.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ExportModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

