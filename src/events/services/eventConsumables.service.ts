import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../entities/Event.entity';
import { EventConsumable } from 'src/consumables/entities/EVentConsumable.entity';
import { Consumable } from 'src/consumables/entities/Consumable.entity';

@Injectable()
export class EventConsumableService {
  constructor(
    @InjectRepository(EventConsumable)
    private readonly eventConsumablesRepository: Repository<EventConsumable>,
  ) {}

  findOne(eventId: number, consumableId: number) {
    return this.eventConsumablesRepository.findOneOrFail({
      where: { eventId, consumableId },
      relations: { event: true, consumable: true },
    });
  }

  async create(event: Event, consumable: Consumable) {
    return this.eventConsumablesRepository.save(
      this.eventConsumablesRepository.create({
        event,
        consumable,
        eventId: event.eventId,
        consumableId: consumable.consumableId,
      }),
    );
  }

  async delete(eventId: number, consumableId: number) {
    const eventConsumable = await this.findOne(eventId, consumableId);
    return this.eventConsumablesRepository.remove(eventConsumable);
  }
}
