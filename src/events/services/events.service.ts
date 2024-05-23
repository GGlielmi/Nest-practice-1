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
import responseMessages from 'src/constants/responseMessages';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly attendeeService: AttendeesService,
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

  private async findById(id: number, select?: FindOptionsSelect<Event>) {
    return this.eventRepository.findOne({
      where: { eventId: id },
      select,
      relations: [...(select?.['attendees'] ? ['attendees'] : [])],
    });
  }

  async getById(id: number, select?: FindOptionsSelect<Event>) {
    const event = await this.findById(id, select);
    if (!event) throw new NotFoundException();
    return event;
  }

  private async checkExistence(id: number) {
    const exists = await this.eventRepository.existsBy({ eventId: id });
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
    const attendee = await this.attendeeService.getById(attendeeId);
    const event = await this.getById(eventId, {
      attendees: { attendeeId: true },
    });
    if (event.minRequiredAge > attendee.age) {
      throw new BadRequestException(
        `Attendee "${attendee.name}" is underaged for this event`,
      );
    }
    event.attendees.push(attendee);
    return this.eventRepository.save(event);
  }

  async removeAttendeeFromEvent(attendeeId: number, eventId: number) {
    const attendee = await this.attendeeService.getById(attendeeId);
    const event = await this.getById(eventId, {
      attendees: { attendeeId: true },
    });
    const newAttendeesList = event.attendees.filter(
      (a) => a.attendeeId !== attendee.attendeeId,
    );
    if (newAttendeesList.length === event.attendees.length) {
      throw new NotFoundException(responseMessages.events.attendeeNotInvited);
    }

    if (attendee.funds < event.cost) {
      throw new NotFoundException(
        responseMessages.events.attendeeInsufficientFunds,
      );
    }

    this.eventRepository.save({ ...event, attendees: newAttendeesList });
  }
}
