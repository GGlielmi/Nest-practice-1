import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { EventAttendee } from '../entities/EventAttendee.entity';
import { Attendee } from 'src/attendees/entities/attendee.entity';
import { Event } from '../entities/Event.entity';

@Injectable()
export class EventAttendeeService {
  constructor(
    @InjectRepository(EventAttendee)
    private readonly eventAttendeesRepository: Repository<EventAttendee>,
  ) {}

  private findOne(eventId: number, attendeeId: number) {
    return this.eventAttendeesRepository.findOne({
      where: { eventId, attendeeId },
      relations: ['event', 'attendee'],
    });
  }

  async getOne(eventId: number, attendeeId: number) {
    const eventAttendee = await this.findOne(eventId, attendeeId);
    if (!eventAttendee) throw new NotFoundException();
    return eventAttendee;
  }

  async create(event: Event, attendee: Attendee, manager?: EntityManager) {
    return manager.save(
      this.eventAttendeesRepository.create({
        event,
        attendee,
        eventId: event.eventId,
        attendeeId: attendee.attendeeId,
      }),
    );
  }

  async delete(eventId: number, attendeeId: number) {
    const eventAttendee = await this.findOne(eventId, attendeeId);
    return this.eventAttendeesRepository.remove(eventAttendee);
  }
}