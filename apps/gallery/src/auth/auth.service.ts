import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('wrong Password');
    }
    if (user && (await bcrypt.compare(password, user.password))) {
      const result = user.toObject();
      return {
        username: result.username,
        id: result._id,
        role: result.role,
      };
    }
    return 'Not Authorized';
  }

  async login(payload: any) {
    const { username, password } = payload;

    const user = await this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const userData = {
      username: user.username,
      sub: user.id,
      role: user.role,
    };
    return {
      message: 'Login successful',
      access_token: this.jwtService.sign(userData),
    };
  }
}
