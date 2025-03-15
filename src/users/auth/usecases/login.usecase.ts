import { Injectable, UnauthorizedException  } from "@nestjs/common";
import { prisma } from "../utils/prisma";
import * as bcrypt from "bcrypt";
import { randomUUID } from "crypto";

@Injectable()
export class LoginUsecase {
    constructor(){}

    async login(login: string) {
        const user = await prisma.user.findFirst({
            where: { login: login },
            select: { password: true, id: true, login: true }
        })
        if (!user) { throw new UnauthorizedException() }
        return { user };
    }

    async comparePass(user_login: string, userPass: string): Promise<{ sessionID: string }> {
        const { user: { id, password, login } } = await this.login(user_login)
        const result = await bcrypt.compare(userPass, password)

        if(!result) {
            throw new UnauthorizedException()
        }

        const session = await prisma.session.create({
            data: {
                user_id: id,
                session_id: randomUUID()
            }
        })

        const payload = { sub: id, username: login }
        
        return { sessionID: session.session_id }
    }

}