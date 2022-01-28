import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToOne,
    JoinTable,
    ManyToOne
  } from 'typeorm';
  
import { UserEntity } from 'src/users/entities/user.entity';
import { TransactionRO } from '../dto/transaction.ro';
  
  @Entity('transactions')
  export class TransactionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'int'})
    amount: number;

    @Column({type: 'int'})
    charges: number;

    @ManyToOne(type => UserEntity, {eager: true})
    @JoinTable()
    sender: UserEntity;

    
    @ManyToOne(type => UserEntity, {eager: true})
    @JoinTable()
    receiver: UserEntity;
  
    @CreateDateColumn({ type: 'timestamp'})
    createdAt: Date;

    toResponseObject(): TransactionRO {
      const { createdAt, amount, sender, receiver, charges } = this;
      const responseObject: TransactionRO = {
        charges,
        amount,
        sender,
        receiver,
        createdAt: createdAt.toString()
      };
      return responseObject;
    }
  
}
  