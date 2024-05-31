import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NoAuth } from 'src/decorators/NoAuthMetadata';
import { AttendeesService } from 'src/attendees/services/attendees.service';
import { ManufacturersService } from 'src/manufacturer/services/manufacturer.service';
import { CreateAttendeeDto } from 'src/attendees/dto/create-attendee.dto';
import { CreateManufacturerDto } from 'src/manufacturer/dto/create-manufacturer.dto';

@Controller()
@ApiTags('Create user')
@NoAuth()
export class UserController {
  constructor(
    private readonly attendeesService: AttendeesService,
    private readonly manufacturersService: ManufacturersService,
  ) {}

  @Post('create-attendee')
  @ApiOperation({ summary: 'Creates an attendee' })
  createAttendee(@Body() createAttendeeDto: CreateAttendeeDto) {
    return this.attendeesService.create(createAttendeeDto);
  }

  @Post('create-manufacturer')
  @ApiOperation({ summary: 'Creates a manufacturer' })
  createManufacturer(@Body() createManufacturerDto: CreateManufacturerDto) {
    return this.manufacturersService.create(createManufacturerDto);
  }
}
