import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class EventAttendeeDto {
  @Field()
  attendeeId: number;
}
