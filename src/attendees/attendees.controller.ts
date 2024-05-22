import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { AttendeesService } from './attendees.service';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { UpdateAttendeeDto } from './dto/update-attendee.dto';
import { EventsService } from 'src/events/services/events.service';

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
  findAll() {
    return this.attendeesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendeesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAttendeeDto: UpdateAttendeeDto,
  ) {
    return this.attendeesService.update(+id, updateAttendeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendeesService.remove(+id);
  }
}
