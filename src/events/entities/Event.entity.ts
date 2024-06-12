import { DOLAR_COST } from 'src/constants';
import {
  AfterLoad,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EventAttendee } from './EventAttendee.entity';
import { EventConsumable } from '../entities/EventConsumable.entity';
import { Exclude } from 'class-transformer';
import { Organizer } from 'src/organizers/entities/Organizer.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Event {
  // constructor(createEventDto: Partial<CreateEventDto> = {}) {
  //   this.name = createEventDto.name;
  //   this.description = createEventDto.description;
  //   this.when = createEventDto.when;
  //   this.address = createEventDto.address;
  //   this.minRequiredAge = createEventDto.minRequiredAge;
  //   this.cost = createEventDto.cost;
  //   this.duration = createEventDto.duration;
  //   this.organizerId = createEventDto.organizerId;
  // }
  // constructor(partial?: Partial<Event>) {
  //   Object.assign(this, partial);
  // }
  @PrimaryGeneratedColumn() // with autoincrement
  @Field()
  eventId: number;

  @Column()
  @Exclude() // this works together with "SerializerInterceptor"
  organizerId: number;

  @ManyToOne(() => Organizer, (organizer) => organizer.events)
  @JoinColumn({ name: 'organizerId' })
  organizer: Organizer;

  @Column()
  @Field()
  name: string;

  @Column({ length: 100 })
  @Field()
  description: string;

  @Column({
    default: 0,
    type: 'real',
    transformer: {
      from: (value) => value * DOLAR_COST,
      to: (value) => value / DOLAR_COST,
    },
  })
  @Field()
  cost: number;

  @Column()
  @Field()
  when: Date;

  @Column()
  @Field()
  address: string;

  @Column({ type: 'time', default: '01:00:00' })
  @Field()
  duration?: string;

  @Column({ default: 0 })
  @Field()
  minRequiredAge?: number;

  @OneToMany(() => EventConsumable, (eventConsumable) => eventConsumable.event)
  eventConsumables: EventConsumable[];

  @Field(() => [EventAttendee], {
    nullable: 'itemsAndList',
  })
  @OneToMany(
    () => EventAttendee,
    (eventAttendee) => eventAttendee.event,
    { lazy: true },
    // { cascade: true }, // this is a typeorm option that enables performing operations on the related entities
  )
  eventAttendees: Promise<EventAttendee[]>;

  // __eventAttendees__?: EventAttendee[];

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

  // toJSON() {
  //   return instanceToPlain(this);
  // }
}
