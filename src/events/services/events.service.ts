import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AttendeesService } from 'src/attendees/services/attendees.service';
import responseMessages from 'src/constants/responseMessages';
import { Consumable } from 'src/manufacturer/entities/Consumable.entity';
import { FindOptionsRelations, FindOptionsSelect, Repository } from 'typeorm';
import { CreateEventDto } from '../dtos/CreateEvent.dto';
import { UpdateEventGqlDto } from '../dtos/UpdateEvent.dto';
import { Event } from '../entities/Event.entity';
import { EventAttendee } from '../entities/EventAttendee.entity';
import { EventFindParams } from '../params/eventFind.dto';
import { EventAttendeeService } from './eventAttendees.service';
import { EventConsumableService } from './eventConsumables.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly attendeeService: AttendeesService,
    private readonly eventAttendeeService: EventAttendeeService,
    private readonly eventConsumableService: EventConsumableService,
  ) {}

  async find(
    eventFindParams: EventFindParams, // a class is needed to use more functionality besides typing, like validation
    relations: FindOptionsRelations<Event> = {},
  ) {
    const resources = await this.eventRepository.find({
      where: eventFindParams.getWhereParams(),
      order: eventFindParams.getOrderParam(),
      relations,
      ...(eventFindParams.take && { take: eventFindParams.take }),
      ...(eventFindParams.skip && { skip: eventFindParams.skip }),
    });
    return { resources, total: 3 };
  }

  create(input: CreateEventDto) {
    return this.eventRepository.save(this.eventRepository.create(input)); // `.save()` inserts if doesn't exist
  }

  async getById({
    eventId,
    organizerId,
    manufacturerId,
    select,
  }: {
    eventId: number;
    organizerId?: number;
    manufacturerId?: number;
    select?: FindOptionsSelect<Event>;
  } & (
    | {
        manufacturerId: number;
      }
    | {
        organizerId: number;
      }
  )) {
    const event = await this.eventRepository.findOneOrFail({
      where: {
        eventId,
        ...(organizerId && { organizerId }),
        ...(manufacturerId && {
          eventConsumables: { consumable: { manufacturerId } },
        }),
      },
      select,
      relations: [
        ...(select?.['eventAttendees'] ? ['eventAttendees'] : []),
        ...(select?.['eventConsumables'] ? ['eventConsumables'] : []),
        ...(manufacturerId
          ? ['eventConsumables.consumable.manufacturerId']
          : []),
      ],
    });
    let attendees: EventAttendee[];
    if (select?.['eventAttendees']) {
      attendees = await event.eventAttendees;
    }
    return { ...event, eventAttendees: attendees };
  }

  async update(eventId: number, organizerId: number, event: UpdateEventGqlDto) {
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

  async addAttendeeToEvent(
    attendeeId: number,
    eventId: number,
    organizerId: number,
  ) {
    const event = await this.getById({ eventId, organizerId });
    const attendee = await this.attendeeService.getById(attendeeId);

    // if (attendee.funds < event.cost) {
    //   throw new BadRequestException(
    //     responseMessages.events.attendeeInsufficientFunds,
    //   );
    // }
    if (event.minRequiredAge > attendee.age) {
      throw new BadRequestException(responseMessages.events.attendeeUnderaged);
    }

    await this.eventRepository.manager.transaction(async (m) => {
      await this.eventAttendeeService.create(
        event.eventId,
        attendee.attendeeId,
        m,
      );
      attendee.funds = attendee.funds - event.cost;
      await this.attendeeService.update(attendeeId, attendee, m);
    });
  }

  async removeAttendeeFromEvent(
    attendeeId: number,
    eventId: number,
    organizerId: number,
  ) {
    await this.eventAttendeeService.delete(attendeeId, eventId, organizerId);
  }

  async addConsumableToEvent(
    eventId: number,
    consumable: Consumable,
    manufacturerId: number,
  ) {
    const event = await this.getById({
      eventId,
      manufacturerId,
      select: {
        eventConsumables: { consumableId: true },
      },
    });
    console.log(event);
    // await this.eventConsumableService.create(event, consumable);
  }

  async removeConsumableFromEvent(args: {
    eventId: number;
    consumable: Consumable;
    manufacturerId: number;
  }): Promise<void>;

  async removeConsumableFromEvent(args: {
    eventId: number;
    consumableId: number;
    organizerId: number;
  }): Promise<void>;

  async removeConsumableFromEvent({
    eventId,
    consumable,
    consumableId,
    organizerId,
    manufacturerId,
  }) {
    await this.eventConsumableService.delete(
      eventId,
      organizerId,
      consumableId ?? (consumable as Consumable).consumableId,
      manufacturerId,
    );
  }
}
