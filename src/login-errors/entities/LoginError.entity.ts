import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LoginError {
  @PrimaryGeneratedColumn()
  loginErrorId: number;

  @Column()
  createdAt: Date;

  @Column('varchar', { array: true, length: 2 })
  credentials: [username: string, password: string];
}
