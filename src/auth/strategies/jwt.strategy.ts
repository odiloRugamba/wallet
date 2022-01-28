import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Constants } from '../../../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: Constants.jwt.secret,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, phoneNumber: payload.phoneNumber, accountType: payload.accountType };
  }
}
