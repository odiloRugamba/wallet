import { ApiProperty } from "@nestjs/swagger";
import { IsPhoneNumber, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    
    @ApiProperty({ minimum: 2, maximum: 20, description: 'Eg: John' })
    @IsString()
    @MinLength(2)
    @MaxLength(20)
    firstName: string;


    @ApiProperty({ minimum: 2, maximum: 20, description: 'Eg: Doe' })
    @IsString()
    @MinLength(2)
    @MaxLength(20)
    lastName: string;
    
    @ApiProperty({ minimum: 10, maximum: 15, description: 'Eg: 0781234567' })
    @IsPhoneNumber("RW")
    @MinLength(10)
    @MaxLength(15)
    phoneNumber: string;
    
    @ApiProperty({ minimum: 4, maximum: 12, description: 'Eg: yqBd234' })
    @IsString()
    @MinLength(4)
    @MaxLength(12)
    password: string;
}
