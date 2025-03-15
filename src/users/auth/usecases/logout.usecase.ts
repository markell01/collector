import { Injectable } from "@nestjs/common";
import { prisma } from "../utils/prisma";


@Injectable()
export class LogoutUsecase {
    async logout(session: string) {
        const sessionID = session.split(' ')
        return await prisma.session.delete({
            where: { session_id: sessionID[1] }
        })
    }
}