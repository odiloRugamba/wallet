import { ApiProperty } from "@nestjs/swagger";
import { IsPhoneNumber, IsString, MaxLength, MinLength } from "class-validator";

export class UpgradeAccountDTO {
    
    
    @ApiProperty({ minimum: 10, maximum: 15, description: 'Eg: 0781234567' })
    @IsPhoneNumber("RW")
    @MinLength(10)
    @MaxLength(15)
    phoneNumber: string;
}
