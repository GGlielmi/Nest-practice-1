import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/Event.entity';
import { EventsController } from './controllers/events.controller';
import { Module } from '@nestjs/common';
import { EventsService } from './services/events.service';
import { AttendeesModule } from 'src/attendees/attendees.module';
import { EventAttendee } from './entities/EventAttendee.entity';
import { EventAttendeeService } from './services/eventAttendees.service';
import { Consumable } from 'src/manufacturer/entities/Consumable.entity';
import { EventConsumableService } from './services/eventConsumables.service';
import { EventConsumable } from './entities/EventConsumable.entity';
import { EventsResolver } from './services/events.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Event,
      EventAttendee,
      Consumable,
      EventConsumable,
    ]),
    AttendeesModule,
  ],
  controllers: [EventsController],
  providers: [
    EventsService,
    EventAttendeeService,
    EventConsumableService,
    EventsResolver,
  ],
  exports: [EventsService],
})
export class EventsModule {}
