import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    BeforeInsert
  } from 'typeorm';
  
  import * as bcrypt from 'bcryptjs';
  import { UserRO } from '../dto/user.ro';
import { Role } from 'src/enums/role.enum';
  
  @Entity('user')
  export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @CreateDateColumn({ type: 'timestamp'})
    created: Date;
  
    @Column({
      type: 'varchar',
      unique: true,
    })
    phoneNumber: string;
  
    @Column('text')
    password: string;
  
    @Column('text')
    firstName: string;
  
    @Column('text')
    lastName: string;

    @Column({type: 'varchar', unique: true, default: null})
    merchantCode: string;

    @Column({type: 'enum', enum: Role, default: Role.CUSTOMER})
    accountType: Role;

    @Column({type: 'text', default: 0})
    balance: number;
  
    @BeforeInsert()
    async hashPassword() {
      this.password = await bcrypt.hash(this.password, 10);
    }
  
    async comparePassword(attempt: string): Promise<boolean> {
      return await bcrypt.compare(attempt, this.password);
    }
  
    toResponseObject(): UserRO {
      const { id, firstName, lastName, phoneNumber, balance, merchantCode, accountType } = this;
      const responseObject: UserRO = {
        id,
        phoneNumber,
        firstName,
        lastName,
        balance,
        merchantCode,
        accountType
      };
      return responseObject;
    }
}
  