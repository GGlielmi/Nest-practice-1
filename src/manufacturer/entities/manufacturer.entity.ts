import { Consumable } from 'src/manufacturer/entities/Consumable.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
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
}
