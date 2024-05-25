import { Module } from '@nestjs/common';
import { ConsumablesService } from './services/consumables.service';
import { ConsumablesController } from './controllers/consumables.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventConsumable } from './entities/EVentConsumable.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventConsumable])],
  controllers: [ConsumablesController],
  providers: [ConsumablesService],
  exports: [ConsumablesService],
})
export class ConsumablesModule {}
