import { IsEnum, IsNotEmpty, IsString, Min } from 'class-validator';
import { ConsumableType } from '../entities/Consumable.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConsumableDto {
  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsEnum(ConsumableType)
  @ApiProperty({ enum: ConsumableType })
  type: ConsumableType;

  @Min(0)
  cost: number;
}
