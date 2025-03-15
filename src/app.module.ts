import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './users/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './users/user/user.module';
import { ClastersAndHousesModule } from './clasters-and-houses/clasters-and-houses.module';
import { UploadFilesModule } from './upload-files/upload-files.module';

@Module({
  imports: [AuthModule, 
    ConfigModule.forRoot({
      isGlobal: true
    }), UserModule, ClastersAndHousesModule, UploadFilesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
