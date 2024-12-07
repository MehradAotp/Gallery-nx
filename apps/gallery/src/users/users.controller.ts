import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserDto, createUserInputDto } from './dto/createUser.dto';
import { Role } from './role.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('register')
  async register(@Body() body: createUserInputDto): Promise<createUserDto> {
    return this.userService.register(
      body.username,
      body.password,
      Role.USER,
      body.email,
    );
  }
}
