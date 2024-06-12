import { Attendee } from 'src/attendees/entities/attendee.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { Event } from './Event.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@ObjectType()
export class EventAttendee {
  @PrimaryGeneratedColumn()
  public eventAttendeeId: number;

  // @Field(() => Event)
  @ManyToOne(() => Event, (event) => event.eventId, {
    onDelete: 'CASCADE', // if I delete an event, the eventAttendee should be deleted
    // lazy: true,
    // cascade: true,
  })
  @JoinColumn({ name: 'eventId' })
  event: Promise<Event>;

  @Column()
  eventId: number;

  @ManyToOne(() => Attendee, (attendee) => attendee.eventsToAttend, {
    onDelete: 'CASCADE', // if I delete an an attendee, the eventAttendee should be deleted
  })
  @JoinColumn({ name: 'attendeeId' })
  attendee: Promise<Attendee>;

  @Column()
  @Field()
  @ApiProperty()
  attendeeId: number;
}
