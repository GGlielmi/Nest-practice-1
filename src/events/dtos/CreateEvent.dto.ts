import { IsInt, Min } from 'class-validator';
import { BaseEventDto } from './BaseEvent.dto';

export class CreateEventDto extends BaseEventDto {
  @Min(0)
  @IsInt()
  organizerId: number = undefined; // set to undefined to easily create an array out of instance properties
}
