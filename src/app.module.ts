import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TransactionModule } from './transaction/transaction.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/role.guard';


@Module({
  imports: [
    UsersModule, 
    AuthModule, 
    TypeOrmModule.forRoot(
      {
        type: "mysql",
        host: process.env.DATABASE_HOST || "localhost",
        port: +process.env.DATABASE_PORT || 3306,
        username: process.env.DB_USERNAME || "root",
        password: process.env.DB_PASSWORD || null,
        database: process.env.POSTGRES_DB || "rssb_wallet",
        entities: ["dist/**/*.entity{.ts,.js}"],
        logging: false,
        synchronize: true
    }
    ), 
    TransactionModule
  ],
  // controllers: [AppController],
  // providers: [AppService],
  
})
export class AppModule {}
