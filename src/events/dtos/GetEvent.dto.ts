import { ApiProperty } from '@nestjs/swagger';
import { Field, ObjectType } from '@nestjs/graphql';
import { EventAttendeeDto } from './EventAttendee.dto';
import { CreateEventDto } from './CreateEvent.dto';
import { Paginated } from 'src/mixins/Paginated.mixin';

@ObjectType()
export class GetEventDto extends CreateEventDto {
  @Field()
  eventId: number;

  @ApiProperty({ example: [{ attendeeId: 0 }] })
  @Field(() => [EventAttendeeDto])
  eventAttendees?: EventAttendeeDto[];
}

export class GetEventsDto extends CreateEventDto {
  @Field()
  eventId: number;

  @ApiProperty({ example: [{ attendeeId: 0 }] })
  __eventAttendees__?: EventAttendeeDto[];
}

@ObjectType()
export class GetEventsResponse extends Paginated(GetEventsDto) {}
