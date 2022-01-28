import { ApiProperty } from "@nestjs/swagger";
import { IsPhoneNumber, IsString, MaxLength, MinLength } from "class-validator";

export class LoginDTO {

    @ApiProperty({ minimum: 10, maximum: 10, description: 'Eg: 0781234567' })
    @IsPhoneNumber("RW")
    @MinLength(10)
    @MaxLength(10)
    phoneNumber: string;
    
    @ApiProperty({ minimum: 4, maximum: 12, description: 'Eg: yqBd234' })
    @IsString()
    @MinLength(4)
    @MaxLength(12)
    password: string;
}
