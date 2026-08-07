import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ContentStatus } from '@prisma/client';

export class CreateContentDto {
  @ApiProperty({ description: 'The title of the content' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'The slug for the content. If not provided, it will be generated from the title.',
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ description: 'The body/content text' })
  @IsNotEmpty()
  @IsString()
  body: string;

  @ApiPropertyOptional({ enum: ContentStatus, default: ContentStatus.DRAFT })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;

  @ApiPropertyOptional({ description: 'The ID of the category this content belongs to' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
