import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { prisma } from "../utils/prisma";



@Injectable()
export class AuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        const authHeader = req.headers['Authorization']

        if(!authHeader) {
            throw new UnauthorizedException('Session doesnt exist')
        }

        const result = await prisma.session.findFirst({
            where: { session_id: authHeader }
        })

        if(!result) {
            return false
        }
        return true
    }
}