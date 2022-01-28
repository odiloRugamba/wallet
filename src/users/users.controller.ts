import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Res, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRO } from './dto/user.ro';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/role.guard';
import {Constants} from '../../constants'
import { Response } from 'express';
import { UpgradeAccountDTO } from './dto/upgrade-account.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('balance')
  async getBalance(@Request() req): Promise<UserRO> {
    const userId = req.user.userId;
    return await this.usersService.getBalance(userId);
  }

  
  @UseGuards(JwtAuthGuard)
  @Get(':accountType/:page')
  async getCustomers(
      @Param('page') page: number, 
      @Param('accountType') accountType: string, 
      @Request() req
    ): Promise<any> {
    const limit = 10;

    // to match indexing
    let pageNumber = page - 1;
    let capitalAccountType = accountType.toUpperCase();
    const results = await this.usersService.getUsers(pageNumber, limit, capitalAccountType);

    return results;
  }

  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('upgrade-account-to-merchant')
  @Roles(Role.ADMIN) 
  async upgradeToMerchantAccount(
    @Body() upgradeAccountDTO: UpgradeAccountDTO,
    @Res() response: Response): Promise<any> {
    try{
    const merchant = await this.usersService.upgradeToMerchantAccount(upgradeAccountDTO.phoneNumber);
    response.status(HttpStatus.OK)
    .send(merchant);
  } catch (error) {
    switch(error.name){
      case Constants.exceptions.USERNOTFOUNDEXCEPTION.NAME:
        response.status(HttpStatus.BAD_REQUEST)
                .send({message: Constants.exceptions.USERNOTFOUNDEXCEPTION.MESSAGE});
        break;
      default:
        response.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .send({message: Constants.exceptions.DEFAULT.MESSAGE});
    }
  }
  }

 
}
