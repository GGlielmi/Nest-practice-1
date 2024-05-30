import {
  attendeeUsernameIndex,
  attendeeEmailIndex,
} from 'src/constants/uniqueIndexes';
import { Column, Index, PrimaryGeneratedColumn } from 'typeorm';

// @Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  // @Index(attendeeUsernameIndex.constraint, { unique: true })
  @Column()
  username: string;

  @Column({ select: false })
  password: string;

  // @Index(attendeeEmailIndex.constraint, { unique: true })
  @Column()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;
}
