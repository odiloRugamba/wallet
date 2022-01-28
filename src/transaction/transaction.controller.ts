import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Res, HttpStatus } from '@nestjs/common';
import { TransactionsService } from './transaction.service';
import { SendMoneyToCustomerDTO } from './dto/send-money-to-customer.dto';
import { SendMoneyToMerchantDTO } from './dto/send-money-to-merchant.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Constants } from '../../constants'
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/role.guard';
@ApiTags('Transactions')
@ApiBearerAuth()
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/send-to-customer')
  async sendToCustomer(@Body() sendMoneyToCustomerDTO: SendMoneyToCustomerDTO, @Request() req, @Res() response: Response) {
    try {
      const sender = req.user.userId;
      const results = await this.transactionService.sendToCustomer(sender, sendMoneyToCustomerDTO);
      response.status(HttpStatus.OK)
      .send(results);

    } catch (error) {
      switch(error.name){
        case Constants.exceptions.INSUFFICIENTBALANCEEXCEPTION.NAME:
          response.status(HttpStatus.BAD_REQUEST)
                  .send({message: Constants.exceptions.INSUFFICIENTBALANCEEXCEPTION.MESSAGE});
          break;
        case Constants.exceptions.USERNOTFOUNDEXCEPTION.NAME:
          response.status(HttpStatus.BAD_REQUEST)
                  .send({message: Constants.exceptions.USERNOTFOUNDEXCEPTION.MESSAGE});
          break;
        
        case Constants.exceptions.SAMEACCOUNTEXCEPTION.NAME:
          response.status(HttpStatus.BAD_REQUEST)
                  .send({message: Constants.exceptions.SAMEACCOUNTEXCEPTION.MESSAGE});
          break;
        default:
          response.status(HttpStatus.INTERNAL_SERVER_ERROR)
                  .send({message: Constants.exceptions.DEFAULT.MESSAGE});
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/send-to-merchant')
  async sendToMerchant(@Body() sendMoneyToMerchantDTO: SendMoneyToMerchantDTO, @Request() req, @Res() response: Response) {
    try {
      const sender = req.user.userId;
      const results = await this.transactionService.sendToMerchant(sender, sendMoneyToMerchantDTO);
      response.status(HttpStatus.OK)
      .send(results);

    } catch (error) {
      switch(error.name){
        case Constants.exceptions.INSUFFICIENTBALANCEEXCEPTION.NAME:
          response.status(HttpStatus.BAD_REQUEST)
                  .send({message: Constants.exceptions.INSUFFICIENTBALANCEEXCEPTION.MESSAGE});
          break;
        case Constants.exceptions.USERNOTFOUNDEXCEPTION.NAME:
          response.status(HttpStatus.BAD_REQUEST)
                  .send({message: Constants.exceptions.USERNOTFOUNDEXCEPTION.MESSAGE});
          break;
        
        case Constants.exceptions.SAMEACCOUNTEXCEPTION.NAME:
          response.status(HttpStatus.BAD_REQUEST)
                  .send({message: Constants.exceptions.SAMEACCOUNTEXCEPTION.MESSAGE});
          break;
        default:
          response.status(HttpStatus.INTERNAL_SERVER_ERROR)
                  .send({message: Constants.exceptions.DEFAULT.MESSAGE});
      }
    }

  }
  
  @UseGuards(JwtAuthGuard)
  @Post('/bulk-payment')
  async bulkPayments(@Body() bulkPayment: [SendMoneyToCustomerDTO], @Request() req, @Res() response: Response) {

    try {
      const sender = req.user.userId;
      let results = [];

      // Do multiple payments 
      await Promise.all(bulkPayment.map(async transaction => {
        const res = await this.transactionService.sendToCustomer(sender, transaction);
        results.push(res);
      }))

      response.status(HttpStatus.OK)
      .send({results});

    } catch (error) {
      switch(error.name){
        case "InsufficientBalanceException":
          response.status(HttpStatus.BAD_REQUEST)
                  .send({message: "Insufficient ballance to send this amount"});
          break;
        case "UserNotFoundException":
          response.status(HttpStatus.BAD_REQUEST)
                  .send({message: "Reciever not found"});
          break;
        case "SameAccountException":
          response.status(HttpStatus.BAD_REQUEST)
                  .send({message: "You cannot send money to yourself"});
          break;
        default:
          console.log(error)
          response.status(HttpStatus.INTERNAL_SERVER_ERROR)
                  .send({message: "We are having issues, Please bear with us as we fix it. Thank you"});
      }
    }


  }
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('all/:page')
  @Roles(Role.ADMIN) 
  getAllTransactions(@Param('page') page: number, @Request() req) {
      const limit = 10;
      
      // to match indexing
      let pageNumber = page - 1;

      return this.transactionService.getAllTransactions(pageNumber, limit );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('big-transactions/:lowerLimit/:page')
  @Roles(Role.ADMIN) 
  getBigTransactions(@Param('lowerLimit') lowerLimit: number, @Param('page') page: number, @Request() req) {
      const limit = 10;
      
      // to match indexing
      let pageNumber = page - 1;
      return this.transactionService.getBigTransactions(lowerLimit, pageNumber, limit );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('user-transactions/:user/:page')
  @Roles(Role.ADMIN) 
  getUserTransactions(@Param('user') user: number, @Param('page') page: number, @Request() req) {
      const limit = 10;
      
      // to match indexing
      let pageNumber = page - 1;
      return this.transactionService.getUserTransactions(user, pageNumber, limit );
  }

}
