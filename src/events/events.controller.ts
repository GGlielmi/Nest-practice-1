import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateEventDto } from './dtos/CreateEvent.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, ILike, Repository } from 'typeorm';
import { Event } from './entities/Event.entity';
import { UpdateEventDto } from './dtos/UpdateEvent.dto';
import { EventFindParams } from './params/eventFind.dto';

@Controller('events')
export class EventsController {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  @Get()
  find(
    @Query()
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
        description: ILike(`%${entityProps.description}%`),
        when: whenFrom || whenTo ? Between(whenFrom, whenTo) : entityProps.when,
        estimatedCost:
          minCost || maxCost
            ? Between(minCost, maxCost)
            : entityProps.estimatedCost,
      },
      ...(orderBy && { order: { [orderBy]: orderDirection } }),
    });
  }

  @Post()
  create(@Body() input: CreateEventDto) {
    return this.eventRepository.save(input);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() input: UpdateEventDto) {
    const foundEvent = await this.eventRepository.findOne({ where: { id } });
    if (!foundEvent) throw new NotFoundException();
    return this.eventRepository.save({ ...foundEvent, ...input, id });
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const result = await this.eventRepository.delete(id);
    if (!result.affected) throw new NotFoundException();
  }
}
