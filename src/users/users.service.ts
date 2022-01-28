import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRO } from './dto/user.ro';
import { InsufficientBalanceException, UserExistsException, UserNotFoundException } from 'src/utils/Custom-exceptions';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private UserRepository: Repository < UserEntity >
  ) {}

  async create(createUserDto: CreateUserDto): Promise < UserRO > {
    try {

      const check = await this.findOneByPhoneNumber(createUserDto.phoneNumber)
      if(check){
        throw new UserExistsException();
      }

      const user = await this.UserRepository.create({
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        phoneNumber: createUserDto.phoneNumber,
        password: createUserDto.password
      })
    
      await this.UserRepository.save(user);
      return user.toResponseObject();

    } catch (error) {
      throw error;
    }
  }

  async findOneByPhoneNumber(phoneNumber: string): Promise < UserEntity > {
    const user = await this.UserRepository.findOne({
      where: {
        phoneNumber
      }
    })
    return user;
  }

  async sendMoney(sender: number, receiver: number, amount: number, charges: number): Promise < UserEntity > {

    const senderData = await this.findById(sender);
    const receiverData = await this.findById(receiver);

    if(senderData.balance - amount < 0 ){
      throw new InsufficientBalanceException();
    }
    
    if(senderData.id === receiverData.id ){
      throw new Error("You can not send money to yourself");
    }

    senderData.balance =  +senderData.balance - (amount + charges);
    receiverData.balance = +receiverData.balance + amount;
    this.UserRepository.update({id: sender} , senderData);
    this.UserRepository.update({id: receiver} , receiverData);

    return senderData;
  }

  async findOneByCode(merchantCode: number): Promise < UserEntity > {
    const user = await this.UserRepository.findOne({
      where: {
        merchantCode
      }
    })
    return user;
  }

  async findById(id: number): Promise < UserEntity > {
    const user = await this.UserRepository.findOne({
      where: {
        id
      }
    })
    return user;
  }
  
  async getBalance(id: number): Promise < UserRO > {
    const user = await this.findById(id)
    return user.toResponseObject();
  }

  async getUsers(page, limit, userType: string): Promise < any> {
    const [result, total] = await this.UserRepository.findAndCount(
        {
            where: { accountType: userType },
            take: limit,
            skip: page * limit
        }
    );

    return {
        data: result,
        count: total
    }

  }

  async upgradeToMerchantAccount(phoneNumber: string): Promise < any > {
    const userData = await this.UserRepository.findOne(phoneNumber)

    if(!userData) {
      throw new UserNotFoundException();
    }

    const count = await this.UserRepository.count(
      {
        where: { accountType: Role.MERCHANT }
      }
    );
    // generate the new code as the last assigned code plus 1 and pad it with zeros to have 5 digits code 
    let merchantCode = (count + 1).toString().padStart(5, "0");

    // update user data to merchant account with merchant code
    const data = await this.UserRepository.save({
      id: userData.id,
      merchantCode: merchantCode,
      accountType: Role.MERCHANT
    });
    
    userData.password = null;
    const results: UserRO = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        balance: userData.balance,
        merchantCode: data.merchantCode,
        accountType: data.accountType,
        id: userData.id
      };
    return results;
  }

}
