import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, Min } from 'class-validator';
import { ConsumableType } from '../entities/Consumable.entity';

export class BaseConsumableDto {
  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsEnum(ConsumableType)
  @ApiProperty({ enum: ConsumableType })
  type: ConsumableType;

  @Min(0)
  cost: number;
}
