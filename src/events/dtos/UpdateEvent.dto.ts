import { PartialType } from '@nestjs/swagger';
import { BaseEventDto } from './BaseEvent.dto';

export class UpdateEventDto extends PartialType(BaseEventDto) {}
