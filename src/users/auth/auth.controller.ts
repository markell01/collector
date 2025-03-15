import { Body, Controller, Post, Req, UnauthorizedException, UsePipes, ValidationPipe } from '@nestjs/common';
import { RegisterUsecase } from './usecases/register.usecase';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LoginUsecase } from './usecases/login.usecase';
import { LogoutUsecase } from './usecases/logout.usecase';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly registerUsecase: RegisterUsecase,
        private readonly loginUsecase: LoginUsecase,
        private readonly logoutUsecase: LogoutUsecase
    ){}

    @Post('/register')
    @UsePipes(new ValidationPipe())
    async createUser(@Body() registerDto: RegisterDto) {
        const result =  await this.registerUsecase.addUser(registerDto)
        if (!result) {
            throw new UnauthorizedException()
        }
        return { message: 'Success!'}
    }

    @Post('/login')
    @UsePipes(new ValidationPipe())
    async loginUser(
        @Body() loginDto: LoginDto
    ) {
        const { sessionID } =  await this.loginUsecase.comparePass(loginDto.login, loginDto.password);
        if(!sessionID) {
            throw new UnauthorizedException()
        }
        return { sessionID }
    }

    @Post('/logout')
    async logoutUser(
        @Req() req: Request
    ) {
        const session = req.header('Authorization')
        console.log(session)
        const result = await this.logoutUsecase.logout(session)

        if (!result) throw new UnauthorizedException('Cant delete session')

        return { message: 'Logout successful' }

    }   
}
