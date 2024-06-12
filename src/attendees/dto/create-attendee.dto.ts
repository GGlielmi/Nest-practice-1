import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

@ObjectType()
export class CreateAttendeeDto {
  @IsNotEmpty()
  @Field()
  name: string;

  @Min(0)
  @Field()
  age: number;

  @IsOptional()
  @IsNumber()
  @Field()
  funds: number = 0;
}
