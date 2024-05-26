import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { Event } from 'src/events/entities/Event.entity';
import { Consumable } from '../../consumables/entities/Consumable.entity';

@Entity()
export class EventConsumable {
  @PrimaryGeneratedColumn()
  public eventConsumableId: number;

  @Column()
  eventId: number;

  @Column()
  consumableId: number;

  @Column({ default: 0 })
  remainingItems: number;

  @ManyToOne(() => Event, (event) => event.eventConsumables, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'eventId' })
  public event: Event;

  @ManyToOne(() => Consumable, (consumable) => consumable.eventConsumables)
  @JoinColumn({ name: 'consumableId' })
  public consumable: Consumable;
}
