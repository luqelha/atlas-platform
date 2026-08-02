import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { ContentService } from '../services/content.service';
import { CreateContentDto } from '../dto/create-content.dto';
import { UpdateContentDto } from '../dto/update-content.dto';
import { QueryContentDto } from '../dto/query-content.dto';
import { ContentEntity } from '../entities/content.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RbacGuard } from '../../../common/guards/rbac.guard';
import { CurrentTenant } from '../../../common/decorators/current-tenant.decorator';
import { Permissions } from '../../../common/decorators/permissions.decorator';
import { Permission } from '../../../common/enums/permission.enum';

@ApiTags('contents')
@Controller('contents')
@UseGuards(JwtAuthGuard, RbacGuard)
@ApiBearerAuth()
@ApiHeader({
  name: 'x-tenant-id',
  required: true,
  description: 'Tenant ID is required for role-based access control and data isolation',
})
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  @Permissions(Permission.CREATE_CONTENT)
  @ApiOperation({ summary: 'Create new content' })
  @ApiResponse({
    status: 201,
    description: 'The content has been successfully created.',
    type: ContentEntity,
  })
  create(
    @CurrentTenant() tenant: any,
    @Request() req: any,
    @Body() createContentDto: CreateContentDto,
  ) {
    return this.contentService.create(tenant.id, req.user.id, createContentDto);
  }

  @Get()
  @Permissions(Permission.READ_CONTENT)
  @ApiOperation({ summary: 'Get all contents for the current tenant' })
  @ApiResponse({ status: 200, description: 'Return paginated contents.' })
  findAll(@CurrentTenant() tenant: any, @Query() queryContentDto: QueryContentDto) {
    return this.contentService.findAll(tenant.id, queryContentDto);
  }

  @Get(':id')
  @Permissions(Permission.READ_CONTENT)
  @ApiOperation({ summary: 'Get content by ID' })
  @ApiResponse({ status: 200, description: 'Return a content.', type: ContentEntity })
  findOne(@CurrentTenant() tenant: any, @Param('id') id: string) {
    return this.contentService.findOne(id, tenant.id);
  }

  @Patch(':id')
  @Permissions(Permission.UPDATE_CONTENT)
  @ApiOperation({ summary: 'Update a content' })
  @ApiResponse({
    status: 200,
    description: 'The content has been successfully updated.',
    type: ContentEntity,
  })
  update(
    @CurrentTenant() tenant: any,
    @Param('id') id: string,
    @Body() updateContentDto: UpdateContentDto,
  ) {
    return this.contentService.update(id, tenant.id, updateContentDto);
  }

  @Delete(':id')
  @Permissions(Permission.DELETE_CONTENT)
  @ApiOperation({ summary: 'Delete a content' })
  @ApiResponse({
    status: 200,
    description: 'The content has been successfully deleted.',
    type: ContentEntity,
  })
  remove(@CurrentTenant() tenant: any, @Param('id') id: string) {
    return this.contentService.remove(id, tenant.id);
  }
}
