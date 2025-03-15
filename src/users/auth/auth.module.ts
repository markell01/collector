import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { Usecases } from './usecases';
import { JwtModule } from '@nestjs/jwt';
import { JWTConstants } from './utils/jwt-constants';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: JWTConstants.secret,
      signOptions: { expiresIn: '1h' }
    })
  ],
  controllers: [AuthController],
  providers: [...Usecases]
})
export class AuthModule {}
