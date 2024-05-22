import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AttendeesService } from '../services/attendees.service';
import { CreateAttendeeDto } from '../dto/create-attendee.dto';
import { UpdateAttendeeDto } from '../dto/update-attendee.dto';
import { FindAttendeeDto } from '../dto/find-attendee.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('attendees')
@ApiTags('Attendees')
export class AttendeesController {
  constructor(private readonly attendeesService: AttendeesService) {}

  @Post()
  async create(@Body() createAttendeeDto: CreateAttendeeDto) {
    return this.attendeesService.save(createAttendeeDto);
  }

  @Get()
  findAll(@Query() findAttendeeDto: FindAttendeeDto) {
    return this.attendeesService.findAll(findAttendeeDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.attendeesService.getById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateAttendeeDto: UpdateAttendeeDto,
  ) {
    return this.attendeesService.update(id, updateAttendeeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.attendeesService.remove(id);
  }

  @Get(':attendeeId/:eventId')
  async addAttendeeToEvent(
    @Param('attendeeId') attendeeId: number,
    @Param('eventId') eventId: number,
  ) {
    return this.attendeesService.addAttendeeToEvent(attendeeId, eventId);
  }
}
