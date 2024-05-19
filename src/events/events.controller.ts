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
  ValidationPipe,
} from '@nestjs/common';
import { CreateEventDto } from './dtos/CreateEvent.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Event } from './entities/Event.entity';
import { UpdateEventDto } from './dtos/UpdateEvent.dto';
import { EventFindParams } from './params/eventFind.params';

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
      ...entityProps
    }: EventFindParams,
  ) {
    return this.eventRepository.find({
      where: {
        ...entityProps,
        when: whenFrom || whenTo ? Between(whenFrom, whenTo) : entityProps.when,
      },
      ...(orderBy && { order: { [orderBy]: orderDirection } }),
    });
  }

  @Post()
  create(@Body() input: CreateEventDto) {
    return this.eventRepository.save(input);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() input: UpdateEventDto) {
    const foundEvent = await this.eventRepository.findOne({ where: { id } });
    if (!foundEvent) throw new NotFoundException();
    return this.eventRepository.save({ ...foundEvent, ...input, id });
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    const result = await this.eventRepository.delete(id);
    if (!result.affected) throw new NotFoundException();
  }
}
