import { Attendee } from 'src/attendees/entities/attendee.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  BeforeUpdate,
  BeforeInsert,
  JoinColumn,
} from 'typeorm';
import { Event } from './Event.entity';
import { BadRequestException } from '@nestjs/common';
import responseMessages from 'src/constants/responseMessages';

@Entity()
export class EventAttendee {
  @PrimaryGeneratedColumn()
  public eventAttendeeId: number;

  @Column()
  eventId: number;

  @Column()
  attendeeId: number;

  @ManyToOne(() => Event, (event) => event.eventAttendees, {
    onDelete: 'CASCADE', // if I delete an event, the eventAttendee should be deleted
  })
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @ManyToOne(() => Attendee, (attendee) => attendee.eventAttendees, {
    onDelete: 'CASCADE', // if I delete an an attendee, the eventAttendee should be deleted
  })
  @JoinColumn({ name: 'attendeeId' })
  attendee: Attendee;

  // @BeforeUpdate()
  // @BeforeInsert()
  // checkAttendeeFunds() {
  //   if (this.attendee.funds < this.event.cost) {
  //     throw new BadRequestException(
  //       responseMessages.events.attendeeInsufficientFunds,
  //     );
  //   }
  // }

  // @BeforeUpdate()
  // @BeforeInsert()
  // checkIfAttendeeIsAgeApropriate() {
  //   if (this.event.minRequiredAge > this.attendee.age) {
  //     throw new BadRequestException(responseMessages.events.attendeeUnderaged);
  //   }
  // }
}
