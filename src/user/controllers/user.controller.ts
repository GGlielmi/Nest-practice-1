import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NoAuth } from 'src/helpers/NoAuthMetadata';
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

  // @Get()
  // @ApiOperation({ summary: 'Get users through http query' })
  // findAll(@Query() query: FindUserDto) {
  //   return this.userService.findAll(query);
  // }

  // @Get(':id')
  // @ApiOperation({ summary: 'Get users by id' })
  // findOne(@Param('id') id: string) {
  //   return this.userService.getById(+id);
  // }

  // @Patch(':id')
  // @ApiOperation({ summary: 'Update user partially' })
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // @ApiOperation({ summary: 'Delete user' })
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
