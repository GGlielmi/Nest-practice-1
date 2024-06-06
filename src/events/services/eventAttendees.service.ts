import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { EventAttendee } from '../entities/EventAttendee.entity';

@Injectable()
export class EventAttendeeService {
  // it's easier to use an explicit join table entity to throw explicit errors when one of the sides, or the relation, don't exist
  constructor(
    @InjectRepository(EventAttendee)
    private readonly eventAttendeesRepository: Repository<EventAttendee>,
  ) {}

  private getOne(eventId: number, attendeeId: number, organizerId: number) {
    return this.eventAttendeesRepository.findOneOrFail({
      where: { eventId, attendeeId, event: { organizerId } },
      relations: { event: true },
      select: {
        event: { organizerId: true },
      },
    });
  }

  async create(eventId: number, attendeeId: number, manager: EntityManager) {
    await manager.save(
      this.eventAttendeesRepository.create({
        eventId,
        attendeeId,
      }),
    );
  }

  async delete(eventId: number, attendeeId: number, organizerId: number) {
    const eventAttendee = await this.getOne(eventId, attendeeId, organizerId);
    await this.eventAttendeesRepository.remove(eventAttendee);
  }
}
