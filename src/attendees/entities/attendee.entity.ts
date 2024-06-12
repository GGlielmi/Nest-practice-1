import { DOLAR_COST } from 'src/constants';
import { ATTENDEE_INSSUFICIENT_FUNDS_CONSTRAINT } from 'src/constants/constraints';
import { Event } from 'src/events/entities/Event.entity';
import { EventAttendee } from 'src/events/entities/EventAttendee.entity';
import {
  Check,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CreateAttendeeDto } from '../dto/create-attendee.dto';

@Entity()
@Check(ATTENDEE_INSSUFICIENT_FUNDS_CONSTRAINT.constraint, `"funds" > 0`)
export class Attendee {
  @PrimaryGeneratedColumn()
  attendeeId: number;

  // constructor(createAttendeeDto: Partial<CreateAttendeeDto> = {}) {
  //   this.name = createAttendeeDto.name;
  //   this.age = createAttendeeDto.age;
  //   this.funds = createAttendeeDto.funds;
  // }
  static role = 'Attendee' as const;
  role = Attendee.role;

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
  eventsToAttend: Promise<EventAttendee[]>;

  @OneToMany(() => Event, (event) => event.organizer, {
    onDelete: 'CASCADE',
  })
  events: Event[];
}
