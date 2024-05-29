import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from '../dtos/CreateEvent.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsSelect, Repository } from 'typeorm';
import { Event } from '../entities/Event.entity';
import { EventFindParams } from '../params/eventFind.dto';
import { AttendeesService } from 'src/attendees/services/attendees.service';
import { EventAttendeeService } from './eventAttendees.service';
import { EventConsumableService } from './eventConsumables.service';
import { Consumable } from 'src/manufacturer/entities/Consumable.entity';
import { UpdateEventDto } from '../dtos/UpdateEvent.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly attendeeService: AttendeesService,
    private readonly eventAttendeeService: EventAttendeeService,
    private readonly eventConsumableService: EventConsumableService,
  ) {}

  find(
    eventFindParams: EventFindParams, // a class is needed to use more functionality besides typing, like validation
    relations: FindOptionsRelations<Event> = {},
  ) {
    return this.eventRepository.findAndCount({
      where: eventFindParams.getWhereParams(),
      order: eventFindParams.getOrderParam(),
      relations,
      ...(eventFindParams.take && { take: eventFindParams.take }),
      ...(eventFindParams.skip && { skip: eventFindParams.skip }),
    });
  }

  save(input: CreateEventDto) {
    return this.eventRepository.save(input); // `.save()` inserts if doesn't exist
  }

  async getById(id: number, select?: FindOptionsSelect<Event>) {
    return this.eventRepository.findOneOrFail({
      where: { eventId: id },
      select,
      relations: [
        ...(select?.['eventAttendees'] ? ['eventAttendees'] : []),
        ...(select?.['eventConsumables'] ? ['eventConsumables'] : []),
      ],
    });
  }

  async checkExistence(eventId: number) {
    const exists = await this.eventRepository.existsBy({ eventId });
    if (!exists) throw new NotFoundException();
  }

  async update(eventId: number, organizerId: number, event: UpdateEventDto) {
    const result = await this.eventRepository.update(
      { eventId, organizerId },
      event,
    );
    if (!result.affected) throw new NotFoundException();
  }

  async delete(id: number, organizerId: number) {
    const result = await this.eventRepository.delete({
      eventId: id,
      organizerId,
    });
    if (!result.affected) throw new NotFoundException();
  }

  async addAttendeeToEvent(attendeeId: number, eventId: number) {
    const event = await this.getById(eventId);
    const attendee = await this.attendeeService.getById(attendeeId);
    this.eventRepository.manager.transaction(async (manager) => {
      await this.eventAttendeeService.create(event, attendee, manager);
    });
  }

  async removeAttendeeFromEvent(attendeeId: number, eventId: number) {
    await this.eventAttendeeService.delete(eventId, attendeeId);
  }

  async addConsumableToEvent(eventId: number, consumable: Consumable) {
    const event = await this.getById(eventId, {
      eventConsumables: { consumableId: true },
    });
    await this.eventConsumableService.create(event, consumable);
  }

  removeConsumableFromEvent(
    eventId: number,
    consumable: Consumable,
  ): Promise<void>;
  removeConsumableFromEvent(
    eventId: number,
    consumableId: number,
  ): Promise<void>;

  async removeConsumableFromEvent(eventId: unknown, consumable: unknown) {
    await this.eventConsumableService.delete(
      eventId as number,
      consumable instanceof Consumable
        ? consumable.consumableId
        : (consumable as number),
    );
  }
}
