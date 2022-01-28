import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString,  Max, MaxLength, Min, MinLength } from "class-validator";
import {Constants} from '../../../constants';

export class SendMoneyToMerchantDTO { 
    @ApiProperty({ minimum: Constants.transaction.MINIMUM, maximum: Constants.transaction.MAXIMUM, description: 'Eg: 3000' })
    @IsInt()
    @Min(Constants.transaction.MINIMUM)
    @Max(Constants.transaction.MAXIMUM)
    amount: number;
    
    @ApiProperty({ minimum: 5, maximum: 6, description: 'Eg: 05555' })
    @IsString()
    @MinLength(5)
    @MaxLength(6)
    merchantCode: number;
}
