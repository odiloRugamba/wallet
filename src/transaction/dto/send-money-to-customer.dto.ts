import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsPhoneNumber, Max, MaxLength, Min, MinLength } from "class-validator";
import {Constants} from '../../../constants';

export class SendMoneyToCustomerDTO {
    
    @ApiProperty({ minimum: Constants.transaction.MINIMUM, maximum: Constants.transaction.MAXIMUM, description: 'Eg: 3000' })
    @IsInt()
    @Min(Constants.transaction.MINIMUM)
    @Max(Constants.transaction.MAXIMUM)
    amount: number;
    
    @ApiProperty({ minimum: 10, maximum: 10, description: 'Eg: 0781234567' })
    @IsPhoneNumber("RW")
    @MinLength(10)
    @MaxLength(10)
    receiver: string;
}
