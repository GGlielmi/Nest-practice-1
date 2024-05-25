import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from '../dtos/CreateEvent.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindOptionsRelations,
  FindOptionsSelect,
  ILike,
  In,
  Repository,
} from 'typeorm';
import { Event } from '../entities/Event.entity';
import { EventFindParams } from '../params/eventFind.dto';
import { UpdateAttendeeDto } from 'src/attendees/dto/update-attendee.dto';
import { AttendeesService } from 'src/attendees/services/attendees.service';
import { EventAttendeeService } from './eventAttendees.service';
import { ConsumablesService } from 'src/consumables/services/consumables.service';
import { EventConsumableService } from './eventConsumables.service';
import { Consumable } from 'src/consumables/entities/Consumable.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly attendeeService: AttendeesService,
    private readonly eventAttendeeService: EventAttendeeService,
    private readonly consumableService: ConsumablesService,
    private readonly eventConsumableService: EventConsumableService,
  ) {}

  find(
    {
      orderBy,
      orderDirection = 'asc',
      whenTo,
      whenFrom,
      minCost,
      maxCost,
      ...entityProps
    }: EventFindParams, // a class is needed to use more functionality besides typing, like validation
    relations?: FindOptionsRelations<Event>,
  ) {
    return this.eventRepository.find({
      where: {
        ...entityProps,
        eventId:
          entityProps.id instanceof Array ? In(entityProps.id) : entityProps.id,
        ...(entityProps.description && {
          description: ILike(`%${entityProps.description}%`),
        }),
        when: whenFrom || whenTo ? Between(whenFrom, whenTo) : entityProps.when,
        cost: minCost || maxCost ? Between(minCost, maxCost) : entityProps.cost,
      },
      ...(orderBy && { order: { [orderBy]: orderDirection } }),
      ...(relations && { relations }),
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

  async removeConsumableFromEvent(eventId: number, consumable: Consumable) {
    await this.eventConsumableService.delete(eventId, consumable.consumableId);
  }
}
