import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EventConsumable } from './EVentConsumable.entity';

export enum ConsumableType {
  DRINK = 'dring',
  FOOD = 'food',
  SOUVENIR = 'souvenir',
}

@Entity()
export class Consumable {
  @PrimaryGeneratedColumn() // with autoincrement
  consumableId: number;

  @OneToMany(
    () => EventConsumable,
    (eventConsumable) => eventConsumable.consumable,
  )
  eventConsumables: EventConsumable[];

  @Column({ enum: ConsumableType })
  type: ConsumableType;

  @Column({ default: 0 })
  cost: number;
}
