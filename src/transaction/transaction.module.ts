import { Module } from '@nestjs/common';
import { TransactionsService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './entities/transaction.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity, UserEntity]), UsersModule],
  controllers: [TransactionController],
  providers: [TransactionsService]
})
export class TransactionModule {}
