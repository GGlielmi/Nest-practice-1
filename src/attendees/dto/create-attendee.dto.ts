import { IsNotEmpty, Min } from 'class-validator';

export class CreateAttendeeDto {
  @IsNotEmpty()
  name: string;

  @Min(0)
  age: number;

  eventsIds: number[];
}
