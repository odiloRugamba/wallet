// import nest core features
import { Module } from '@nestjs/common';
// import auth packages
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

// add user module
import { UsersModule } from '../users/users.module';

// auth module files
import { AuthService } from './auth.service';
import {AthController} from './auth.controller'
import { Constants } from '../../constants';

// import strategies
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';


@Module({
  imports: [
    UsersModule,
    PassportModule,
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: Constants.jwt.secret,
      signOptions: { expiresIn: Constants.jwt.expirationDate },
    }),
  ],
  controllers: [AthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
