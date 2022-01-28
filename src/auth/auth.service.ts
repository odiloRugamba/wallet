import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(phoneNumber: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByPhoneNumber(phoneNumber);
    if (user && (await bcryptjs.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { phoneNumber: user.phoneNumber, sub: user.id, accountType: user.accountType };
    return {
      ...user,
      token: this.jwtService.sign(payload),
    };
  }
}
