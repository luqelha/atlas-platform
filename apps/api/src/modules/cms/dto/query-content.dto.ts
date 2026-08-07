import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsUUID } from 'class-validator';
import { ContentStatus } from '@prisma/client';
import { PageOptionsDto } from '../../../common/dto/page-options.dto';

export class QueryContentDto extends PageOptionsDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly search?: string;

  @ApiPropertyOptional({ enum: ContentStatus })
  @IsEnum(ContentStatus)
  @IsOptional()
  readonly status?: ContentStatus;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  readonly categoryId?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  readonly authorId?: string;
}
