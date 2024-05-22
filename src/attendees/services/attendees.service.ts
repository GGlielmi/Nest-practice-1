import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAttendeeDto } from '../dto/create-attendee.dto';
import { UpdateAttendeeDto } from '../dto/update-attendee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from '../entities/attendee.entity';
import { Repository } from 'typeorm';
import { FindAttendeeDto } from '../dto/find-attendee.dto';
import { EventsService } from 'src/events/services/events.service';

// await this.attendeeRepository
//   .createQueryBuilder()
//   .relation(Event, 'attendees')
//   .of(1)
//   .add(3);
// this.attendeeRepository.manager.transaction(runInTransaction)

@Injectable()
export class AttendeesService {
  constructor(
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
    private readonly eventsService: EventsService,
  ) {}

  async save(createAttendeeDto: CreateAttendeeDto) {
    const { eventsIds, ...attendee } = createAttendeeDto;
    const events = await this.eventsService.find(
      { id: eventsIds },
      { attendees: true },
    );
    if (events.length !== createAttendeeDto.eventsIds.length) {
      const missingEvents = eventsIds.filter(
        (id) => !events.some((e) => e.id === id),
      );
      throw new NotFoundException(`Eventos [${missingEvents}] no encontrados`);
    }

    await this.attendeeRepository.save(
      this.attendeeRepository.create({
        // `.create` does not create id;
        ...attendee,
        events,
      }),
    );
  }

  findAll(findAttendeeDto: FindAttendeeDto) {
    return this.attendeeRepository.findBy(findAttendeeDto);
  }

  private findById(id: number) {
    return this.attendeeRepository.findOneBy({ id });
  }

  async getById(id: number) {
    const attendee = await this.findById(id);
    if (!attendee) throw new NotFoundException();
    return attendee;
  }

  async update(id: number, updateAttendeeDto: UpdateAttendeeDto) {
    const result = await this.attendeeRepository.update(id, updateAttendeeDto);
    if (!result.affected) throw new NotFoundException();
  }

  async remove(id: number) {
    const result = await this.attendeeRepository.delete(id);
    if (!result.affected) throw new NotFoundException();
  }

  async addAttendeeToEvent(attendeeId: number, eventId: number) {
    const event = await this.eventsService.getById(eventId);
    const attendee = await this.getById(attendeeId);
    if (event.minRequiredAge > attendee.age) {
      throw new BadRequestException(
        `Attendee "${attendee.name}" is underaged for desired event`,
      );
    }
    event.attendees.push(attendee);
    return this.eventsService.update(event);
  }
}
