import { DOLAR_COST } from 'src/constants';
import {
  attendeeEmailIndex,
  attendeeUsernameIndex,
} from 'src/constants/uniqueIndexes';
import { Event } from 'src/events/entities/Event.entity';
import { EventAttendee } from 'src/events/entities/EventAttendee.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Attendee extends User {
  static role = 'Attendee' as const;

  @Index(attendeeUsernameIndex.constraint, { unique: true })
  username: string;

  @Index(attendeeEmailIndex.constraint, { unique: true })
  email: string;

  @PrimaryGeneratedColumn()
  attendeeId: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column({
    type: 'float',
    default: 0,
    transformer: {
      from: (value) => value * DOLAR_COST,
      to: (value) => value / DOLAR_COST,
    },
  })
  funds: number;

  @OneToMany(() => EventAttendee, (eventAttendee) => eventAttendee.attendee, {
    onDelete: 'CASCADE', // if I delete an event, the eventAttendee should be deleted
  })
  eventAttendees: EventAttendee[];

  // @Column()
  // userId: number;

  // @OneToOne(() => User, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'userId' })
  // user: User;

  @OneToMany(() => Event, (event) => event.organizer, {
    onDelete: 'CASCADE',
  })
  events: Event[];
}
