import { USERNAME_INDEX, USER_EMAIL_INDEX } from 'src/constants/uniqueIndexes';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Index(USERNAME_INDEX.constraint, { unique: true })
  @Column()
  username: string;

  @Column()
  password: string;

  @Index(USER_EMAIL_INDEX.constraint, { unique: true })
  @Column()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;
}
