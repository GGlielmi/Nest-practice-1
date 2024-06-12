import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Resolver,
  Args,
  ResolveField,
  Parent,
  Mutation,
  Int,
  Query,
} from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { EventFindAllResponse } from 'src/graphql/FindAllQuery';
import { Repository, FindOptionsSelect } from 'typeorm';
import { CreateEventDto } from '../dtos/CreateEvent.dto';
import { UpdateEventGqlDto, DeleteEventGqlDto } from '../dtos/UpdateEvent.dto';
import { EventAttendee } from '../entities/EventAttendee.entity';
import { EventFindParams } from '../params/eventFind.dto';
import { Event } from '../entities/Event.entity';
import { Paginated } from 'src/mixins/Paginated.mixin';
import { FindAllResult } from 'src/helpers/Paginated.dto';

@Injectable()
@Resolver(Event)
export class EventsResolver {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  @Query(() => EventFindAllResponse) // graphql doesn't support tuples
  async find(
    @Args('findParams', {
      nullable: true,
      type: () => EventFindParams,
      defaultValue: new EventFindParams(),
    })
    eventFindParams: EventFindParams,
  ) {
    return new FindAllResult(
      ...(await this.eventRepository.findAndCount({
        where: eventFindParams.getWhereParams(),
        order: eventFindParams.getOrderParam(),
        // relations: { eventAttendees: true },
        ...(eventFindParams.take && { take: eventFindParams.take }),
        ...(eventFindParams.skip && { skip: eventFindParams.skip }),
      })),
    );
  }

  @ResolveField('eventAttendees') // this is for loading lazy loaded relation
  // this way, the related entities are not loaded unless explicitly stated in query
  // eventAttendees prop should be a Promise in the entity
  // prop name could be either method name, or passed explicitly as ResolveField arg
  async eventAttendees(@Parent() event: Event) {
    // return (event as any).__promise_eventAttendees__;
    return this.eventRepository
      .createQueryBuilder()
      .relation(Event, 'eventAttendees')
      .of(event)
      .loadMany<EventAttendee>();
  }

  @Mutation(() => Event, { name: 'eventCreate' })
  create(@Args('input', { type: () => CreateEventDto }) input: CreateEventDto) {
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

  @Mutation(() => Boolean)
  async update(
    eventId: number,
    organizerId: number,
    @Args('updateEventDto', {
      nullable: true,
      type: () => UpdateEventGqlDto,
    })
    event: UpdateEventGqlDto,
  ) {
    const result = await this.eventRepository.update(
      { eventId, organizerId },
      event,
    );
    if (!result.affected) throw new NotFoundException();
  }

  @Mutation(() => DeleteEventGqlDto)
  async delete(
    @Args('id', { type: () => Int }) id: number,
    organizerId: number,
  ) {
    const result = await this.eventRepository.delete({
      eventId: id,
      organizerId,
    });
    if (!result.affected) throw new NotFoundException();
    return result.raw;
  }
}
