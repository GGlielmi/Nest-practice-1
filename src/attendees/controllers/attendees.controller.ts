import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AttendeesService } from '../services/attendees.service';
import { UpdateAttendeeDto } from '../dto/update-attendee.dto';
import { FindAttendeeDto } from '../dto/find-attendee.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('attendees')
@ApiTags('Attendees')
export class AttendeesController {
  constructor(private readonly attendeesService: AttendeesService) {}

  @ApiOperation({ summary: 'Search atendees through query parameters' })
  @Get()
  findAll(@Query() findAttendeeDto: FindAttendeeDto) {
    return this.attendeesService.findAll(findAttendeeDto);
  }

  @ApiOperation({ summary: 'Get atendee by id' })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.attendeesService.getById(id);
  }

  @ApiOperation({ summary: 'Update atendee partially' })
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateAttendeeDto: UpdateAttendeeDto,
  ) {
    return this.attendeesService.update({ ...updateAttendeeDto, id });
  }

  @ApiOperation({ summary: 'Delete atendee' })
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.attendeesService.remove(id);
  }
}
