import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Login {
  @PrimaryGeneratedColumn()
  loginId: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column('varchar', { array: true })
  credentials: [username: string, password: string];

  @Column()
  userAgent: string;

  @Column()
  ipAddress: string;

  @Column({ type: 'bool' })
  failed: boolean;
}
