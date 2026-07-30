import { Role } from '../enums/role.enum';
import { Permission } from '../enums/permission.enum';

export const RolePermissions: Record<Role, Permission[]> = {
  [Role.ADMIN]: [
    Permission.MANAGE_TENANT,
    Permission.MANAGE_USERS,
    Permission.READ_USERS,
    Permission.CREATE_CONTENT,
    Permission.READ_CONTENT,
    Permission.UPDATE_CONTENT,
    Permission.DELETE_CONTENT,
    Permission.PUBLISH_CONTENT,
    Permission.MANAGE_MEDIA,
    Permission.READ_MEDIA,
    Permission.READ_AUDIT_LOGS,
  ],
  [Role.EDITOR]: [
    Permission.READ_USERS,
    Permission.CREATE_CONTENT,
    Permission.READ_CONTENT,
    Permission.UPDATE_CONTENT,
    Permission.PUBLISH_CONTENT,
    Permission.MANAGE_MEDIA,
    Permission.READ_MEDIA,
  ],
  [Role.VIEWER]: [Permission.READ_CONTENT, Permission.READ_MEDIA],
};
