import { IsNotEmpty } from 'class-validator';

export class CreateAttendeeDto {
  @IsNotEmpty()
  name: string;
  eventsIds: string[];
}
