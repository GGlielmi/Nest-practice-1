import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsOptional, Length, Matches, Max, Min } from 'class-validator';

@InputType({ isAbstract: true })
export class BaseEventDto {
  @Length(1)
  @Field()
  name: string = undefined; // set to undefined to easily create an array out of instance properties

  @Length(1, 100)
  @Field()
  description: string = undefined;

  @IsDate()
  @Field()
  when: Date = undefined;

  @Length(1)
  @Field()
  address: string = undefined;

  @IsOptional()
  @Min(0)
  @Field()
  minRequiredAge?: number = undefined;

  @IsOptional()
  @Min(0)
  @Max(1_000_000)
  @Field()
  cost?: number = undefined;

  @IsOptional()
  @Matches(/^(?:2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]$/)
  @Field()
  duration?: string = undefined;
}
