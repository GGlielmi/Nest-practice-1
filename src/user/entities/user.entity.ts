import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class User {
  role: string;

  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  username: string;

  @Column({ select: false })
  password: string;

  @Column()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;
}
