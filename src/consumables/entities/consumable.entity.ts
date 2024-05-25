import { Event } from 'src/events/entities/Event.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

enum ConsumableType {
  DRINK,
  FOOD,
  SOUVENIR,
}

@Entity()
export class Consumable {
  @PrimaryGeneratedColumn() // with autoincrement
  consumableId: number;

  @ManyToMany(() => Event, (event) => event.consumables)
  events: Event[];

  @Column({ enum: ConsumableType })
  type: ConsumableType;

  @Column({ default: 0 })
  cost: number;

  @Column({ default: 0 })
  remainingItems: number;
}
