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
import { CreateEventDto } from '../dtos/CreateEvent.dto';
import { UpdateEventDto } from '../dtos/UpdateEvent.dto';
import { EventFindParams } from '../params/eventFind.dto';
import { EventsService } from '../services/events.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('events')
@ApiTags('Events')
export class EventsController {
  constructor(private readonly eventService: EventsService) {}

  @Get()
  find(
    @Query()
    params: EventFindParams, // a class is needed to use more functionality besides typing, like validation
  ) {
    return this.eventService.find(params);
  }

  @Post()
  create(@Body() input: CreateEventDto) {
    return this.eventService.create(input);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() input: UpdateEventDto) {
    const foundEvent = await this.eventService.findById(id);
    if (!foundEvent) throw new NotFoundException();
    return this.eventService.update(id, { ...foundEvent, ...input });
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    const result = await this.eventService.delete(id);
    if (!result.affected) throw new NotFoundException();
  }
}
