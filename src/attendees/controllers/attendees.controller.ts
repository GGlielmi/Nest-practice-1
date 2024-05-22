import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { AttendeesService } from '../services/attendees.service';
import { CreateAttendeeDto } from '../dto/create-attendee.dto';
import { UpdateAttendeeDto } from '../dto/update-attendee.dto';
import { EventsService } from 'src/events/services/events.service';
import { FindAttendeeDto } from '../dto/find-attendee.dto';

@Controller('attendees')
export class AttendeesController {
  constructor(
    private readonly attendeesService: AttendeesService,
    private readonly eventsService: EventsService,
  ) {}

  @Post()
  async create(@Body() createAttendeeDto: CreateAttendeeDto) {
    const { eventsIds, ...attendee } = createAttendeeDto;
    const events = await this.eventsService.find({ id: eventsIds });
    if (events.length !== createAttendeeDto.eventsIds.length) {
      const firstEventIdNotFound = eventsIds.filter(
        (id) => !events.some((e) => e.id === id),
      );
      throw new NotFoundException(
        `Eventos [${firstEventIdNotFound}] no encontrados`,
      );
    }
    return this.attendeesService.create({ ...attendee, events });
  }

  @Get()
  findAll(@Query() findAttendeeDto: FindAttendeeDto) {
    return this.attendeesService.findAll(findAttendeeDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendeesService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAttendeeDto: UpdateAttendeeDto,
  ) {
    const result = await this.attendeesService.update(id, updateAttendeeDto);
    if (!result.affected) throw new NotFoundException();
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.attendeesService.remove(id);
    if (!result.affected) throw new NotFoundException();
  }

  @Get(':attendeeId/:eventId')
  async addAttendeeToEvent(
    @Param('attendeeId') attendeeId: string,
    @Param('eventId') eventId: string,
  ) {
    const event = await this.eventsService.findById(eventId);
    if (!event) throw new NotFoundException();
    const attendee = await this.attendeesService.findById(attendeeId);
    event.attendees.push(attendee);
    return this.eventsService.update(eventId, attendee);
  }
}
