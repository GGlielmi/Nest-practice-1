import { IsEnum, Min } from 'class-validator';
import { ConsumableType } from '../entities/Consumable.entity';

export class CreateConsumableDto {
  @IsEnum(ConsumableType)
  type: ConsumableType;

  @Min(0)
  cost: number;
}
