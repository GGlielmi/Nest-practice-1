import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CreateEventDto } from '../dtos/CreateEvent.dto';
import { UpdateEventDto } from '../dtos/UpdateEvent.dto';
import { EventFindParams } from '../params/eventFind.dto';
import { EventsService } from '../services/events.service';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GetEvent } from '../dtos/GetEvent.dto';
import { PaginationResultInterceptor } from 'src/interceptors/pagination-result/pagination-result.interceptor';

@Controller('events')
@ApiTags('Events')
export class EventsController {
  constructor(private readonly eventService: EventsService) {}

  @UseInterceptors(PaginationResultInterceptor)
  @ApiOperation({ summary: 'Search events through query parameters' })
  @Get()
  find(
    @Query()
    params: EventFindParams, // a class is needed to use more functionality besides typing, like validation
  ) {
    return this.eventService.find(params);
  }

  @ApiOperation({ summary: 'Get event by id' })
  @Get(':id')
  findById(@Param('id') id: number): Promise<GetEvent> {
    return this.eventService.getById(id, {
      eventAttendees: { attendeeId: true },
    });
  }

  @ApiOperation({ summary: 'Create event' })
  @ApiCreatedResponse()
  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.save(createEventDto);
  }

  @ApiOperation({ summary: 'Update event partially' })
  @ApiNoContentResponse()
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventService.update({ id, ...updateEventDto });
  }

  @ApiOperation({ summary: 'Delete event' })
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.eventService.delete(id);
  }

  @ApiOperation({ summary: 'Adds atendee to existing event' })
  @ApiNotFoundResponse({
    description:
      'Possible reasons: Event not found; Attendee not found; Atendee is underaged for this event',
  })
  @Get(':eventId/attendees/:attendeeId')
  async addAttendeeToEvent(
    @Param('attendeeId') attendeeId: number,
    @Param('eventId') eventId: number,
  ) {
    return this.eventService.addAttendeeToEvent(attendeeId, eventId);
  }

  @ApiOperation({ summary: 'Removes atendee from existing event' })
  @ApiNotFoundResponse({
    description:
      'Possible reasons: Event not found; Attendee not found; Atendee was not included in event',
  })
  @Delete(':eventId/attendees/:attendeeId')
  async removeAttendeeFromEvent(
    @Param('attendeeId') attendeeId: number,
    @Param('eventId') eventId: number,
  ) {
    return this.eventService.removeAttendeeFromEvent(attendeeId, eventId);
  }

  @Get(':eventId/consumables/:consumableId')
  async removeConsumableFromEvent(eventId: number, consumableId: number) {
    return this.eventService.removeConsumableFromEvent(eventId, consumableId);
  }
}
