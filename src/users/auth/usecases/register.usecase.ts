import { Injectable } from "@nestjs/common";
import { RegisterDto } from "../dto/register.dto";
import { prisma } from "../utils/prisma";
import * as bcrypt  from "bcrypt"

@Injectable()
export class RegisterUsecase {
    async addUser(datas: RegisterDto) {
        const hashedPass = await this.createHashedPassword(datas.password)
        return prisma.user.create({
            data: {
                login: datas.login,
                password: hashedPass,
            }
        })
    }

    async createHashedPassword(password: string) {
        const pass = password;
        const saltRound: number = 10;
        return await bcrypt.hash(pass, saltRound)
    }
}