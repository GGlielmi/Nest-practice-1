import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/Event.entity';
import { EventsController } from './controllers/events.controller';
import { Module } from '@nestjs/common';
import { EventsService } from './services/events.service';
import { AttendeesModule } from 'src/attendees/attendees.module';
import { EventAttendee } from './entities/EventAttendee.entity';
import { EventAttendeeService } from './services/eventAttendees.service';
import { Consumable } from 'src/consumables/entities/Consumable.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, EventAttendee, Consumable]),
    AttendeesModule,
  ],
  controllers: [EventsController],
  providers: [EventsService, EventAttendeeService],
})
export class EventsModule {}
