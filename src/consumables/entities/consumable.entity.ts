import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EventConsumable } from '../../events/entities/EventConsumable.entity';
import { Manufacturer } from 'src/manufacturer/entities/manufacturer.entity';

export enum ConsumableType {
  DRINK = 'drink',
  FOOD = 'food',
  SOUVENIR = 'souvenir',
}

@Entity()
export class Consumable {
  @PrimaryGeneratedColumn() // with autoincrement
  consumableId: number;

  @Column({ unique: true })
  brand: string;

  @Column({ enum: ConsumableType })
  type: ConsumableType;

  @Column({ default: 0 })
  cost: number;

  @ManyToOne(() => Manufacturer, (manufacturer) => manufacturer.consumables)
  manufacturer: Manufacturer;

  @OneToMany(
    () => EventConsumable,
    (eventConsumable) => eventConsumable.consumable,
  )
  eventConsumables: EventConsumable[];
}
