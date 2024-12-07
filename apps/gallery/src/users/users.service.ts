import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './users.schema';
import { Model } from 'mongoose';
import { Role } from './role.enum';
import * as bcrypt from 'bcrypt';
import { createUserDto } from './dto/createUser.dto';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async register(
    username: string,
    password: string,
    role: Role = Role.USER,
    email: string,
  ): Promise<createUserDto> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      username,
      password: hashedPassword,
      role,
      email,
    });
    const savedUser = await newUser.save();
    const result = savedUser.toObject();
    return {
      id: result._id.toString(),
      username: result.username,
      role: result.role,
      email: result.email,
    };
  }

  async findOne(username: string): Promise<User> {
    return this.userModel.findOne({ username });
  }

  async findById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    return user;
  }
}
