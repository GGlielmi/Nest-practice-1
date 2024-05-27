import { PartialType } from '@nestjs/swagger';
import { BaseConsumableDto } from './base-consumable.dto';

export class UpdateConsumableDto extends PartialType(BaseConsumableDto) {}
