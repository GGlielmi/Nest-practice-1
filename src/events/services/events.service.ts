import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from '../dtos/CreateEvent.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsRelations, ILike, In, Repository } from 'typeorm';
import { Event } from '../entities/Event.entity';
import { EventFindParams } from '../params/eventFind.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
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
        id:
          entityProps.id instanceof Array ? In(entityProps.id) : entityProps.id,
        ...(entityProps.description && {
          description: ILike(`%${entityProps.description}%`),
        }),
        when: whenFrom || whenTo ? Between(whenFrom, whenTo) : entityProps.when,
        estimatedCost:
          minCost || maxCost
            ? Between(minCost, maxCost)
            : entityProps.estimatedCost,
      },
      ...(orderBy && { order: { [orderBy]: orderDirection } }),
      ...(relations && { relations }),
    });
  }

  save(input: CreateEventDto) {
    return this.eventRepository.save(input);
  }

  private async findById(id: number) {
    return this.eventRepository.findOneBy({ id });
  }

  async getById(id: number) {
    const event = await this.findById(id);
    if (!event) throw new NotFoundException();
    return event;
  }

  async update(event: Event) {
    return this.eventRepository.save(event);
  }

  async delete(id: number) {
    const result = await this.eventRepository.delete(id);
    if (!result.affected) throw new NotFoundException();
  }
}
