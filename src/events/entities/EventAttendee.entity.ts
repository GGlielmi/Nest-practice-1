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

  eventId: number;

  attendeeId: number;

  @ManyToOne(() => Event, (event) => event.eventAttendees)
  @JoinColumn({ name: 'eventId' })
  public event: Event;

  @ManyToOne(() => Attendee, (attendee) => attendee.eventAttendees)
  @JoinColumn({ name: 'attendeeId' })
  public attendee: Attendee;

  @BeforeUpdate()
  @BeforeInsert()
  checkAttendeeFunds() {
    if (this.attendee.funds < this.event.cost) {
      throw new BadRequestException(
        responseMessages.events.attendeeInsufficientFunds,
      );
    }
  }

  @BeforeUpdate()
  @BeforeInsert()
  checkIfAttendeeIsAgeApropriate() {
    if (this.event.minRequiredAge > this.attendee.age) {
      throw new BadRequestException(responseMessages.events.attendeeUnderaged);
    }
  }
}
