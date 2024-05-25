import { Module } from '@nestjs/common';
import { ConsumablesService } from './services/consumables.service';
import { ConsumablesController } from './controllers/consumables.controller';

@Module({
  controllers: [ConsumablesController],
  providers: [ConsumablesService],
})
export class ConsumablesModule {}
