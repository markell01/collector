import { MaxLength, MinLength } from "class-validator"


export class RegisterDto {
    @MinLength(5, { message: 'Логин не меньше 5 символов' })
    @MaxLength(16)
    login: string

    @MinLength(6, { message: 'Пароль не меньше 6 символов' })
    @MaxLength(24)
    password: string
}