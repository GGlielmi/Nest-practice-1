import { DOLAR_COST } from 'src/constants';
import { EventAttendee } from 'src/events/entities/EventAttendee.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
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
    onDelete: 'CASCADE',
  })
  eventAttendees: EventAttendee[];

  @Column()
  userId: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
