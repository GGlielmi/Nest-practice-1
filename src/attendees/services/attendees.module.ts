import { Module } from '@nestjs/common';
import { AttendeesService } from '../attendees.service';
import { AttendeesController } from '../attendees.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendee } from '../entities/attendee.entity';
import { Event } from 'src/events/entities/Event.entity';
import { EventsModule } from 'src/events/Event.module';

@Module({
  imports: [TypeOrmModule.forFeature([Attendee, Event]), EventsModule],
  controllers: [AttendeesController],
  providers: [AttendeesService],
})
export class AttendeesModule {}
