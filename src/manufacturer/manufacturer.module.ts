import { Module } from '@nestjs/common';
import { ManufacturerService } from './services/manufacturer.service';
import { ManufacturerController } from './controllers/manufacturer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manufacturer } from './entities/manufacturer.entity';
import { EventsModule } from 'src/events/Event.module';
import { ConsumablesModule } from 'src/consumables/consumables.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Manufacturer]),
    EventsModule,
    ConsumablesModule,
  ],
  controllers: [ManufacturerController],
  providers: [ManufacturerService],
})
export class ManufacturerModule {}
