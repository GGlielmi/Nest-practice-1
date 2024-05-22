import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from '../dtos/CreateEvent.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, ILike, In, Repository } from 'typeorm';
import { Event } from '../entities/Event.entity';
import { UpdateEventDto } from '../dtos/UpdateEvent.dto';
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
    });
  }

  create(input: CreateEventDto) {
    return this.eventRepository.save(input);
  }

  async findById(id: number) {
    return this.eventRepository.findOneBy({ id });
  }

  async update(id: number, input: UpdateEventDto) {
    return this.eventRepository.save({ ...input, id });
  }

  async delete(id: number) {
    return this.eventRepository.delete(id);
  }
}
