import { USERNAME_INDEX, USER_EMAIL_INDEX } from 'src/constants/uniqueIndexes';
import { Event } from 'src/events/entities/Event.entity';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Index(USERNAME_INDEX.constraint, { unique: true })
  @Column()
  username: string;

  @Column({ select: false })
  password: string;

  @Index(USER_EMAIL_INDEX.constraint, { unique: true })
  @Column()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @OneToMany(() => Event, (event) => event.organizer, {
    onDelete: 'CASCADE',
  })
  events: Event[];
}
