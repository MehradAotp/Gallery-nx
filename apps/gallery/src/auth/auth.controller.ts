import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginInputDto, loginUser } from './dto/loginUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(@Body() body: loginInputDto): Promise<loginUser> {
    return this.authService.login(body);
  }
}
