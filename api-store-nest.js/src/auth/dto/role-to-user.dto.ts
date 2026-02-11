import { ApiProperty } from '@nestjs/swagger';

export class RoleToUserDto {
  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 1 })
  roleId: number;
}
