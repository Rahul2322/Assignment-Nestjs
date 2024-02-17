// user.dto.ts
import { IsNotEmpty, IsArray, IsString, IsNumber } from '@nestjs/class-validator';

export class CreateUserDto {
 

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsNumber()
    age: number;

    @IsArray()
    @IsString({ each: true })
    hobbies: string[];
}

export class UpdateUserDto {
    @IsString()
    username: string;

    @IsNumber()
    age: number;

    @IsArray()
    @IsString({ each: true })
    hobbies: string[];
}
