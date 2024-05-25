import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EventConsumable } from './EVentConsumable.entity';

enum ConsumableType {
  DRINK,
  FOOD,
  SOUVENIR,
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
