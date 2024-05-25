import { Consumable } from 'src/consumables/entities/Consumable.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Manufacturer {
  @PrimaryGeneratedColumn() // with autoincrement
  manufacturerId: number;

  @Column()
  name: string;

  @OneToMany(() => Consumable, (consumable) => consumable.manufacturer)
  consumables: Consumable[];
}
