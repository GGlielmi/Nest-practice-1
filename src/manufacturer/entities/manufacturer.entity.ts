import { Consumable } from 'src/manufacturer/entities/Consumable.entity';
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
export class Manufacturer {
  @PrimaryGeneratedColumn() // with autoincrement
  manufacturerId: number;

  @Column()
  name: string;

  @OneToMany(() => Consumable, (consumable) => consumable.manufacturer, {
    onDelete: 'CASCADE',
  })
  consumables: Consumable[];

  @Column()
  userId: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
