
import { MaxLength, MinLength } from "class-validator";

export class LoginDto {
    @MinLength(5)
    @MaxLength(16)
    login: string

    @MinLength(6)
    @MaxLength(24)    
    password: string
}