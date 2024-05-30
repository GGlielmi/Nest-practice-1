import { Module } from '@nestjs/common';
import { ManufacturersService } from './services/manufacturer.service';
import { ManufacturerController } from './controllers/manufacturer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manufacturer } from './entities/Manufacturer.entity';
import { EventsModule } from 'src/events/Event.module';
import { ConsumablesService } from './services/consumables.service';
import { Consumable } from './entities/Consumable.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Manufacturer, Consumable]), EventsModule],
  controllers: [ManufacturerController],
  providers: [ManufacturersService, ConsumablesService],
  exports: [ManufacturersService],
})
export class ManufacturerModule {}
