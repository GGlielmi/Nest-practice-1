import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/Event.entity';
import { EventsController } from './controllers/events.controller';
import { Module } from '@nestjs/common';
import { EventsService } from './services/events.service';
import { AttendeesModule } from 'src/attendees/attendees.module';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), AttendeesModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
