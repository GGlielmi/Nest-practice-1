import { Module } from '@nestjs/common';
import { ConsumablesService } from './services/consumables.service';
import { ConsumablesController } from './controllers/consumables.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consumable } from './entities/Consumable.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Consumable])],
  controllers: [ConsumablesController],
  providers: [ConsumablesService],
  exports: [ConsumablesService],
})
export class ConsumablesModule {}
