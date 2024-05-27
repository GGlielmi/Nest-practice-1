import { IsNumber } from 'class-validator';
import { BaseConsumableDto } from './base-consumable.dto';

export class CreateConsumableDto extends BaseConsumableDto {
  @IsNumber()
  manufacturerId: number;
}
