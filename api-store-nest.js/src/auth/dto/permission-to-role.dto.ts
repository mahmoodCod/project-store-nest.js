import { ApiProperty } from '@nestjs/swagger';

export class PermissionToRoleDto {
  @ApiProperty({ example: 1 })
  permissionId: number;

  @ApiProperty({ example: 1 })
  roleId: number;
}
