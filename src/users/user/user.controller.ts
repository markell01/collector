import { Controller, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/guard/auth.guard';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
    constructor(private readonly userService: UserService){}

    @Post('/login')
    async changeLogin(old_login: string, new_login: string) {
        const result = await this.userService.changeLogin(old_login, new_login)
        
        if (result == false) {
            return { message: 'Не удалось изменить логин' }
        }

        return { message: 'Логин успешно изменен'}
    }
}
