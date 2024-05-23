import { BadRequestException } from '@nestjs/common';
import { Event } from 'src/events/entities/Event.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Attendee {
  @PrimaryGeneratedColumn()
  attendeeId: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column({ default: 0 })
  funds: number;

  @ManyToMany(() => Event, (event) => event.attendees)
  events: Event[];

  private validateAttendeeAge(event: Event) {
    if (event.minRequiredAge > this.age) {
      throw new BadRequestException(
        `Attendee "${this.name}" is underaged for desired event`,
      );
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  validateAttendeesAge() {
    // HOOKS ARE CALLED WITH `.create()`
    (this.events || []).forEach(this.validateAttendeeAge);
  }
}
