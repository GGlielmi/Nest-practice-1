import { BadRequestException } from '@nestjs/common';
import { Attendee } from 'src/attendees/entities/attendee.entity';
import { DOLAR_COST } from 'src/constants';
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EventAttendee } from './EventAttendee.entity';
import { EventConsumable } from '../entities/EventConsumable.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn() // with autoincrement
  eventId: number;

  @Column()
  name: string;

  @Column({ length: 100 })
  description: string;

  @Column({
    default: 0,
    transformer: {
      from: (value) => value * DOLAR_COST,
      to: (value) => value / DOLAR_COST,
    },
  })
  cost: number;

  @Column()
  when: Date;

  @Column()
  address: string;

  @Column({ type: 'time', default: '01:00:00' })
  duration?: string;

  @Column({ default: 0 })
  minRequiredAge?: number;

  @OneToMany(() => EventConsumable, (eventConsumable) => eventConsumable.event)
  eventConsumables: EventConsumable[];

  @OneToMany(
    () => EventAttendee,
    (eventAttendee) => eventAttendee.event,
    // { cascade: true} // this is a typeorm option that enables performing operations on the related entities
  )
  eventAttendees: EventAttendee[];

  validateAttendeeAge(attendee: Attendee) {
    if (this.minRequiredAge > attendee.age) {
      throw new BadRequestException(
        `Attendee ${attendee.name} is underaged for desired event`,
      );
    }
  }

  finishDate: Date;
  @AfterLoad()
  setFinishDate() {
    const [hours, minutes, seconds] = this.duration.split(':');
    const finishDate = new Date(this.when);
    finishDate.setHours(finishDate.getHours() + +hours);
    finishDate.setMinutes(finishDate.getMinutes() + +minutes);
    finishDate.setSeconds(finishDate.getSeconds() + +seconds);
    this.finishDate = finishDate;
  }

  @BeforeInsert()
  @BeforeUpdate()
  formatWhenField() {
    this.when = new Date(this.when);
  }
}
