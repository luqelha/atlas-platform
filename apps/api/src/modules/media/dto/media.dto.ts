import { ApiProperty } from '@nestjs/swagger';

export class MediaResponseDto {
  @ApiProperty({ description: 'The unique identifier of the media' })
  id: string;

  @ApiProperty({ description: 'The URL to access the media' })
  url: string;

  @ApiProperty({ description: 'The MIME type of the media (e.g. image/png)' })
  type: string;

  @ApiProperty({ description: 'The ID of the tenant owning the media' })
  tenantId: string;

  @ApiProperty({ description: 'When the media was uploaded' })
  createdAt: Date;
}
