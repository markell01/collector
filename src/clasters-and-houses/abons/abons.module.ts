import { Module } from '@nestjs/common';
import { AbonsController } from './abons.controller';
import { AbonsService } from './abons.service';

@Module({
  controllers: [AbonsController],
  providers: [AbonsService]
})
export class AbonsModule {}
