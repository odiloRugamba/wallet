import { Body, Controller, Get, HttpStatus, Post, Request, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/create-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Constants } from '../../constants';
import { Response } from 'express';

@ApiTags('Authentication')

@Controller('auth')
export class AthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
    ) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async login(@Body() loginDTO: LoginDTO, @Request() req) {

    return this.authService.login(req.user);
  }

  
  @Post('signup')
  async create(@Body() createUserDto: CreateUserDto, @Res() response: Response) {
    try {
      const results = await this.usersService.create(createUserDto);
      response.status(HttpStatus.OK)
      .send(results);
    } catch (error) {
      console.log(error)
      switch(error.name){
        case Constants.exceptions.USEREXISTSEXCEPTION.NAME:
          response.status(HttpStatus.BAD_REQUEST)
                  .send({message: Constants.exceptions.USEREXISTSEXCEPTION.MESSAGE});
          break;
        default:
          response.status(HttpStatus.INTERNAL_SERVER_ERROR)
                  .send({message: Constants.exceptions.DEFAULT.MESSAGE});
      }
    }

  }


  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
