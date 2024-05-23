import { DOLAR_COST } from 'src/constants';
import { EventAttendee } from 'src/events/entities/EventAttendee.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Attendee {
  @PrimaryGeneratedColumn()
  attendeeId: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column({
    default: 0,
    transformer: {
      from: (value) => value * DOLAR_COST,
      to: (value) => value / DOLAR_COST,
    },
  })
  funds: number;

  @OneToMany(() => EventAttendee, (eventAttendee) => eventAttendee.attendee)
  eventAttendees: EventAttendee[];
}
