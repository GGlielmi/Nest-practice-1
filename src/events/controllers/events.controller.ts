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
import { CurrentUser } from 'src/decorators/getUser.decorator';
import { BaseEventDto } from '../dtos/BaseEvent.dto';
import { User } from 'src/user/entities/user.entity';
import { NoAuth } from 'src/decorators/NoAuthMetadata';

@Controller('events')
@ApiTags('Events')
export class EventsController {
  constructor(private readonly eventService: EventsService) {}

  @UseInterceptors(PaginationResultInterceptor)
  @ApiOperation({ summary: 'Search events through query parameters' })
  @NoAuth()
  @Get()
  find(
    @Query()
    params: EventFindParams, // a class is needed to use more functionality besides typing, like validation
  ) {
    return this.eventService.find(params);
  }

  @ApiOperation({ summary: 'Get event by id' })
  @NoAuth()
  @Get(':id')
  findById(
    @Param('id') id: number,
    @CurrentUser() user: User,
  ): Promise<GetEvent> {
    return this.eventService.getById({
      eventId: id,
      organizerId: user.userId,
      select: {
        eventAttendees: { attendeeId: true },
      },
    });
  }

  @ApiOperation({ summary: 'Create event' })
  @ApiCreatedResponse()
  @NoAuth()
  @Post()
  create(@Body() baseEventDto: BaseEventDto, @CurrentUser() user: User) {
    return this.eventService.save({
      ...baseEventDto,
      organizerId: user.userId,
    });
  }

  @ApiOperation({ summary: 'Update event partially' })
  @ApiNoContentResponse()
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateEventDto: UpdateEventDto,
    @CurrentUser() user: User,
  ) {
    return this.eventService.update(id, user.userId, updateEventDto);
  }

  @ApiOperation({ summary: 'Delete event' })
  @Delete(':id')
  async delete(@Param('id') id: number, @CurrentUser() user: User) {
    return this.eventService.delete(id, user.userId);
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
    @CurrentUser() user: User,
  ) {
    return this.eventService.addAttendeeToEvent(
      attendeeId,
      eventId,
      user.userId,
    );
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
    @CurrentUser() user: User,
  ) {
    return this.eventService.removeAttendeeFromEvent(
      attendeeId,
      eventId,
      user.userId,
    );
  }

  @Get(':eventId/consumables/:consumableId')
  async removeConsumableFromEvent(
    @Param('eventId') eventId: number,
    @Param('consumableId') consumableId: number,
    @CurrentUser() user: User,
  ) {
    return this.eventService.removeConsumableFromEvent({
      eventId,
      organizerId: user.userId,
      consumableId,
    });
  }
}
