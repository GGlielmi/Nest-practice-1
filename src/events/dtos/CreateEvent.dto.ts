import { IsDate, IsOptional, Length, Max, Min } from 'class-validator';

export class CreateEventDto {
  @Length(1)
  name: string = undefined;

  @Length(1, 100)
  description: string = undefined;

  @IsDate()
  when: Date = undefined;

  @Length(1)
  address: string = undefined;

  @IsOptional()
  @Min(0)
  @Max(1_000_000)
  estimatedCost?: number = 0;
}
