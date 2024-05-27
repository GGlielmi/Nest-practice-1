import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EventConsumable } from '../../events/entities/EventConsumable.entity';
import { Manufacturer } from 'src/manufacturer/entities/Manufacturer.entity';

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

  @Column()
  manufacturerId: number;

  @ManyToOne(() => Manufacturer, (manufacturer) => manufacturer.consumables, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'manufacturerId' })
  manufacturer: Manufacturer;

  @OneToMany(
    () => EventConsumable,
    (eventConsumable) => eventConsumable.consumable,
  )
  eventConsumables: EventConsumable[];
}