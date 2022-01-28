// import { UserEntity } from "src/users/entities/user.entity";

export class TransactionRO {
    amount: number;
    charges: number;
    createdAt: string;
    sender: UserForTransactionRO;
    receiver: UserForTransactionRO;
}

export class UserForTransactionRO {
    firstName: string;
    lastName: string;
    phoneNumber: string;
}
