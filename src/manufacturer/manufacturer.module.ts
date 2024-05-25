import { Module } from '@nestjs/common';
import { ManufacturerService } from './services/manufacturer.service';
import { ManufacturerController } from './controllers/manufacturer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manufacturer } from './entities/manufacturer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Manufacturer])],
  controllers: [ManufacturerController],
  providers: [ManufacturerService],
})
export class ManufacturerModule {}
