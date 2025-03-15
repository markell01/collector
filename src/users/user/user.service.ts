import { Injectable } from '@nestjs/common';
import { prisma } from '../auth/utils/prisma';

@Injectable()
export class UserService {
    async checkLogin(login: string) {
        const result = await prisma.user.findFirst({
            where: { login }
        })

        if (!result) {
            return true
        }

        return false
    }

    async changeLogin(old_login: string, new_login: string) {
        const check = await this.checkLogin(new_login);

        if(check == false) {
            return { message: 'Пользователь с таким логином уже есть' }
        }

        const result = await prisma.user.update({
            where: { login: old_login },
            data: { login: new_login }
        })

        if (!result) {
            return false
        }

        return true
    }
}
