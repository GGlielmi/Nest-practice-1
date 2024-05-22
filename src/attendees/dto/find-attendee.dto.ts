import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, Min } from 'class-validator';

class _FindAttendeeDto {
  @IsNotEmpty()
  name: string;

  @Min(0)
  age: number;
}

export class FindAttendeeDto extends PartialType(_FindAttendeeDto) {}
