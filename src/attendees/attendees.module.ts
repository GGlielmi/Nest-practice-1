import { Module } from '@nestjs/common';
import { AttendeesService } from './services/attendees.service';
import { AttendeesController } from './controllers/attendees.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendee } from './entities/attendee.entity';
import { Event } from 'src/events/entities/Event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attendee, Event])],
  controllers: [AttendeesController],
  providers: [AttendeesService],
  exports: [AttendeesService],
})
export class AttendeesModule {}
