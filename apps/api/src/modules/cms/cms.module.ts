import { Module } from '@nestjs/common';
import { CategoryController } from './controllers/category.controller';
import { CategoryService } from './services/category.service';
import { ContentController } from './controllers/content.controller';
import { ContentService } from './services/content.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoryController, ContentController],
  providers: [CategoryService, ContentService],
  exports: [CategoryService, ContentService],
})
export class CmsModule {}
