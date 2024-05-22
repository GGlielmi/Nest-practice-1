import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/Event.entity';
import { EventsController } from './controllers/events.controller';
import { Module } from '@nestjs/common';
import { EventsService } from './services/events.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
