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
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Attendee } from '../entities/attendee.entity';

@Controller('attendees')
@ApiTags('Attendees')
export class AttendeesController {
  constructor(private readonly attendeesService: AttendeesService) {}

  @Post()
  @ApiOperation({ summary: 'Create atendee' })
  @ApiCreatedResponse({ type: Attendee })
  async create(@Body() createAttendeeDto: CreateAttendeeDto) {
    return this.attendeesService.save(createAttendeeDto);
  }

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
