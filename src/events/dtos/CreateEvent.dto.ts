import { IsDate, IsOptional, Length, Max, Min } from 'class-validator';

export class CreateEventDto {
  @Length(1)
  name: string = undefined; // set to undefined to easily create an array out of instance properties

  @Length(1, 100)
  description: string = undefined;

  @IsDate()
  when: Date = undefined;

  @Length(1)
  address: string = undefined;

  @IsOptional()
  @Min(0)
  minRequiredAge: number = undefined;

  @IsOptional()
  @Min(0)
  @Max(1_000_000)
  cost?: number = undefined;
}
