import { Attendee } from 'src/attendees/entities/attendee.entity';
import { DOLAR_COST } from 'src/constants';
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid') // with autoincrement
  id: string;

  @Column()
  name: string;

  @Column({ length: 100 })
  description: string;

  @Column({
    default: 0,
    transformer: {
      from: (value) => value * DOLAR_COST,
      to: (value) => value,
    },
  })
  estimatedCost: number;

  @Column()
  when: Date;

  @Column()
  address: string;

  @Column({ type: 'time', default: '01:00:00' })
  duration: string;

  @ManyToMany(
    () => Attendee,
    (attendee) => attendee.events, // this is necessary
  )
  // when using OneToMany, ManyToOne is mandatory on the other side
  @JoinTable()
  attendees: Attendee[];

  finishDate: Date;
  @AfterLoad()
  setFinishTime() {
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
