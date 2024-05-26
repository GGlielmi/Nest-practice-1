import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from '../dtos/CreateEvent.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsSelect, Repository } from 'typeorm';
import { Event } from '../entities/Event.entity';
import { EventFindParams } from '../params/eventFind.dto';
import { UpdateAttendeeDto } from 'src/attendees/dto/update-attendee.dto';
import { AttendeesService } from 'src/attendees/services/attendees.service';
import { EventAttendeeService } from './eventAttendees.service';
import { EventConsumableService } from './eventConsumables.service';
import { Consumable } from 'src/consumables/entities/Consumable.entity';

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
    return this.eventRepository.find({
      where: eventFindParams.getWhereParams(),
      order: eventFindParams.getOrderParam(),
      relations,
    });
  }

  save(input: CreateEventDto) {
    return this.eventRepository.save(input);
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

  async update(event: UpdateAttendeeDto) {
    await this.checkExistence(event.id);
    return this.eventRepository.save(event); // `.save()` inserts if doesn't exist
  }

  async delete(id: number) {
    const result = await this.eventRepository.delete(id);
    if (!result.affected) throw new NotFoundException();
  }

  async addAttendeeToEvent(attendeeId: number, eventId: number) {
    const event = await this.getById(eventId);
    const attendee = await this.attendeeService.getById(attendeeId);
    this.eventRepository.manager.transaction(async (manager) => {
      await this.eventAttendeeService.create(event, attendee, manager);
      attendee.funds -= event.cost;
      await manager.save(attendee);
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
