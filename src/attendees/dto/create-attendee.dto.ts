import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateAttendeeDto {
  @IsNotEmpty()
  name: string;

  @Min(0)
  age: number;

  @IsOptional()
  @IsNumber()
  funds: number = 0;
}
