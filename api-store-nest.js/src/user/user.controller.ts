import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import UserRoleEnum from './enum/userRoleEnum';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Management users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const createUser = await this.userService.create(createUserDto);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: createUser,
      message: 'User created successfully :))',
    });
  }

  @Get()
  async findAll(
    @Res() res: Response,
    @Query('role') role?: UserRoleEnum,
    @Query('limit') limit: number = 10,
    @Query('page') page: number = 1,
  ) {
    const users = await this.userService.findAll(role, limit, page);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: users,
      message: 'users all successfully :))',
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const getUsers = await this.userService.findOne(+id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: getUsers,
      message: 'Users get successfully :))',
    });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    const updateUsers = await this.userService.update(+id, updateUserDto);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: updateUsers,
      message: 'Users updated successfully :))',
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const removeUser = await this.userService.remove(+id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      data: removeUser,
      message: 'Users removed successfully :))',
    });
  }
}
