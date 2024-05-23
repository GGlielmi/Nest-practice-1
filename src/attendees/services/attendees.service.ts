import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAttendeeDto } from '../dto/create-attendee.dto';
import { UpdateAttendeeDto } from '../dto/update-attendee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from '../entities/attendee.entity';
import { Repository } from 'typeorm';
import { FindAttendeeDto } from '../dto/find-attendee.dto';

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
  ) {}

  async save(createAttendeeDto: CreateAttendeeDto) {
    return this.attendeeRepository.save(
      this.attendeeRepository.create(createAttendeeDto), // `.create` does not create id;
    );
  }

  findAll(findAttendeeDto: FindAttendeeDto) {
    return this.attendeeRepository.findBy(findAttendeeDto);
  }

  private findById(id: number) {
    return this.attendeeRepository.findOneBy({ attendeeId: id });
  }

  async getById(id: number) {
    const attendee = await this.findById(id);
    if (!attendee) throw new NotFoundException();
    return attendee;
  }

  private async checkExistence(id: number) {
    const exists = await this.attendeeRepository.existsBy({ attendeeId: id });
    if (!exists) throw new NotFoundException();
  }

  async update(updateAttendeeDto: UpdateAttendeeDto) {
    await this.checkExistence(updateAttendeeDto.id);
    return this.attendeeRepository.save(updateAttendeeDto); // save inserts if doesn't exist
  }

  async remove(id: number) {
    const result = await this.attendeeRepository.delete(id);
    if (!result.affected) throw new NotFoundException();
  }
}
