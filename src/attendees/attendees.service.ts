import { Injectable } from '@nestjs/common';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { UpdateAttendeeDto } from './dto/update-attendee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from './entities/attendee.entity';
import { Repository } from 'typeorm';
import { Event } from 'src/events/entities/Event.entity';
import { FindAttendeeDto } from './dto/find-attendee.dto';

@Injectable()
export class AttendeesService {
  constructor(
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
  ) {}

  async create(
    createAttendeeDto: Omit<CreateAttendeeDto, 'eventsIds'> & {
      events: Event[];
    },
  ) {
    return this.attendeeRepository.save(createAttendeeDto);
  }

  findAll(findAttendeeDto: FindAttendeeDto) {
    return this.attendeeRepository.findBy(findAttendeeDto);
  }

  findById(id: string) {
    return this.attendeeRepository.findOneBy({ id });
  }

  update(id: string, updateAttendeeDto: UpdateAttendeeDto) {
    return this.attendeeRepository.update({ id }, updateAttendeeDto);
  }

  remove(id: string) {
    return this.attendeeRepository.delete(id);
  }
}
