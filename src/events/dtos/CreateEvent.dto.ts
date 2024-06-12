import { IsInt, Min } from 'class-validator';
import { BaseEventDto } from './BaseEvent.dto';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
@InputType('CreateEventDtoInput', { isAbstract: true })
export class CreateEventDto extends BaseEventDto {
  @Min(0)
  @IsInt()
  @Field()
  organizerId: number = undefined; // set to undefined to easily create an array out of instance properties
}
