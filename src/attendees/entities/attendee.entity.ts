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
  id: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @ManyToMany(() => Event, (event) => event.attendees)
  events: Event[];

  @BeforeInsert()
  @BeforeUpdate()
  validateAttendeesAge() {
    // HOOKS ARE CALLED WITH `.create()`
    this.events.forEach((e) => {
      if (e.minRequiredAge > this.age) {
        throw new BadRequestException(
          `Attendee "${this.name}" is underaged for desired event`,
        );
      }
    });
  }
}
