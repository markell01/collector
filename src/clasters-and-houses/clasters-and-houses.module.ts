import { Module } from '@nestjs/common';
import { ClastersController } from './clasters-and-houses.controller';
import { ClastersService } from './clasters-and-houses.service';
import { AbonsModule } from './abons/abons.module';

@Module({
  controllers: [ClastersController],
  providers: [ClastersService],
  imports: [AbonsModule]
})
export class ClastersAndHousesModule {}
