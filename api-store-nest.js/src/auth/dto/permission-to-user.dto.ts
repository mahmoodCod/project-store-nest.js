import { ApiProperty } from '@nestjs/swagger';

export class PermissionToUserDto {
  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 1 })
  permissionId: number;
}
