import {
  Injectable
} from '@nestjs/common';
import {
  TransactionEntity
} from './entities/transaction.entity';

import {
  SendMoneyToCustomerDTO
} from './dto/send-money-to-customer.dto';

import {
  MoreThan,
  Repository
} from 'typeorm';

import {
  InjectRepository
} from '@nestjs/typeorm';
import {
  TransactionRO
} from './dto/transaction.ro';

import { UsersService } from 'src/users/users.service';
import { SendMoneyToMerchantDTO } from './dto/send-money-to-merchant.dto';
import { InsufficientBalanceException, SameAccountException, UserNotFoundException } from 'src/utils/Custom-exceptions';


@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionEntity) private TransactionRepository: Repository < TransactionEntity >,
    private readonly usersService: UsersService,
  ) {}

  async sendToCustomer(sender: number, sendMoneyToCustomerDTO: SendMoneyToCustomerDTO): Promise < TransactionRO > {
    try {

      console.log("sendMoneyToCustomerDTO", sendMoneyToCustomerDTO)

      const senderData = await this.usersService.findById(sender);
      const receiverData = await this.usersService.findOneByPhoneNumber(sendMoneyToCustomerDTO.receiver);
      
      if(!receiverData){
        throw new UserNotFoundException();
      }
      else if(senderData.balance - sendMoneyToCustomerDTO.amount <= 0){
        throw new InsufficientBalanceException();
      }
      else if(sender === receiverData.id){
        throw new SameAccountException();
      }
      const charges = this.calculateCharges(sendMoneyToCustomerDTO.amount);
      const transaction = await this.TransactionRepository.create({
        amount: sendMoneyToCustomerDTO.amount,
        sender: senderData,
        receiver: receiverData,
        charges: charges
      })
      await this.TransactionRepository.save(transaction);
      await this.usersService.sendMoney(sender, receiverData.id, sendMoneyToCustomerDTO.amount, charges)
      return transaction.toResponseObject();
    } catch (error) {
      throw error;
    }
  }
  
  async sendToMerchant(sender: number, sendMoneyToMerchantDTO: SendMoneyToMerchantDTO): Promise < TransactionRO > {
    try {
      const senderData = await this.usersService.findById(sender);
      const receiverData = await this.usersService.findOneByCode(sendMoneyToMerchantDTO.merchantCode);
      
      if(!receiverData){
        throw new UserNotFoundException();
      }
      else if(senderData.balance - sendMoneyToMerchantDTO.amount <= 0){
        throw new InsufficientBalanceException();
      }
      else if(sender === receiverData.id){
        throw new SameAccountException();
      }


      const charges = this.calculateCharges(sendMoneyToMerchantDTO.amount);

      const transaction = await this.TransactionRepository.create({
        amount: sendMoneyToMerchantDTO.amount,
        sender: senderData,
        receiver: receiverData,
        charges: charges
      });

      await this.TransactionRepository.save(transaction);
      await this.usersService.sendMoney(sender, receiverData.id, sendMoneyToMerchantDTO.amount, charges);
      return transaction.toResponseObject();
      
    } catch (error) {
      throw error;
    }
  }

  async findOne(phoneNumber: string): Promise < TransactionEntity > {
    const transaction = await this.TransactionRepository.findOne({
      where: {
        phoneNumber
      }
    })
    return transaction;
  }

  async findById(id: number): Promise < TransactionRO > {
    const transaction = await this.TransactionRepository.findOne({
      where: {
        id
      }
    })
    return transaction.toResponseObject();
  }
   
  async getAllTransactions(page, limit): Promise <any> {
    const [result, total] = await this.TransactionRepository.findAndCount(
        {
            take: limit,
            skip: page * limit
        }
    );

    const transactions: TransactionRO[] = [];
    
    result?.map(trans => {
      let temp: TransactionRO = {
        amount: trans.amount,
        charges: trans.charges,
        createdAt: trans.createdAt.toString(),
        sender: {
          firstName: trans.sender.firstName,
          lastName: trans.sender.lastName,
          phoneNumber: trans.sender.phoneNumber
        },
        receiver: {
          firstName: trans.receiver.firstName,
          lastName: trans.receiver.lastName,
          phoneNumber: trans.receiver.phoneNumber
        }
      }
      transactions.push(temp);
    })

    return {
      count: total,
      data: transactions
    }

  }

  async getBigTransactions(lowerLimit: number, page: number, limit: number): Promise < any> {

    const [result, total] = await this.TransactionRepository.findAndCount(
        {
            where: {amount: MoreThan(lowerLimit)},
            take: limit,
            skip: page * limit
        }
    );
    
    const transactions: TransactionRO[] = [];
    
    result?.map(trans => {
      let temp: TransactionRO = {
        amount: trans.amount,
        charges: trans.charges,
        createdAt: trans.createdAt.toString(),
        sender: {
          firstName: trans.sender.firstName,
          lastName: trans.sender.lastName,
          phoneNumber: trans.sender.phoneNumber
        },
        receiver: {
          firstName: trans.receiver.firstName,
          lastName: trans.receiver.lastName,
          phoneNumber: trans.receiver.phoneNumber
        }
      }
      transactions.push(temp);
    })

    return {
      count: total,
      data: transactions
    }
  }

  async getUserTransactions(user, page, limit): Promise < any> {
    const [result, total] = await this.TransactionRepository.findAndCount(
        {
            where: [{sender: user}, {receiver: user}], 
            take: limit,
            skip: page * limit
        }
    );
    
    const transactions: TransactionRO[] = [];
    
    result?.map(trans => {
      let temp: TransactionRO = {
        amount: trans.amount,
        charges: trans.charges,
        createdAt: trans.createdAt.toString(),
        sender: {
          firstName: trans.sender.firstName,
          lastName: trans.sender.lastName,
          phoneNumber: trans.sender.phoneNumber
        },
        receiver: {
          firstName: trans.receiver.firstName,
          lastName: trans.receiver.lastName,
          phoneNumber: trans.receiver.phoneNumber
        }
      }
      transactions.push(temp);
    })

    return {
      count: total,
      data: transactions
    }
  }

  calculateCharges(amount: number){
    if(amount <= 1000){
      return 50;
    }
    else if(amount<= 99999){
      return 800;
    }else{
      return 1200;
    }
  }

}
