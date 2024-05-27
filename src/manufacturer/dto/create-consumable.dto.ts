import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ConsumableType } from '../../manufacturer/entities/Consumable.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConsumableDto {
  @IsNumber()
  manufacturerId: number;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsEnum(ConsumableType)
  @ApiProperty({ enum: ConsumableType })
  type: ConsumableType;

  @Min(0)
  cost: number;
}
