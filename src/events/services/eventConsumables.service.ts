import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../entities/Event.entity';
import { EventConsumable } from '../entities/EventConsumable.entity';
import { Consumable } from 'src/manufacturer/entities/Consumable.entity';

@Injectable()
export class EventConsumableService {
  constructor(
    @InjectRepository(EventConsumable)
    private readonly eventConsumablesRepository: Repository<EventConsumable>,
  ) {}

  findOne(
    eventId: number,
    consumableId: number,
    organizerId: number,
    manufacturerId: number,
  ) {
    return this.eventConsumablesRepository.findOneOrFail({
      where: {
        eventId,
        consumableId,
        ...(organizerId && { event: { organizerId } }),
        ...(manufacturerId && { consumable: { manufacturerId } }),
      },
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

  async delete(
    eventId: number,
    consumableId: number,
    organizerId: number,
    manufacturerId: number,
  ) {
    const eventConsumable = await this.findOne(
      eventId,
      consumableId,
      organizerId,
      manufacturerId,
    );
    return this.eventConsumablesRepository.remove(eventConsumable);
  }
}
