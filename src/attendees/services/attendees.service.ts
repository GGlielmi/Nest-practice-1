import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAttendeeDto } from '../dto/create-attendee.dto';
import { UpdateAttendeeDto } from '../dto/update-attendee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from '../entities/attendee.entity';
import { EntityManager, Repository } from 'typeorm';
import { FindAttendeeDto } from '../dto/find-attendee.dto';
import { Query, Resolver } from '@nestjs/graphql';

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

  async create(createAttendeeDto: CreateAttendeeDto) {
    const attendee = await this.attendeeRepository.save(
      this.attendeeRepository.create(createAttendeeDto), // `.create` does not create id;
    );
    return attendee.attendeeId;
  }

  @Query(() => [CreateAttendeeDto])
  findAll(findAttendeeDto: FindAttendeeDto) {
    return this.attendeeRepository.findBy(findAttendeeDto);
  }

  async getById(id: number) {
    return this.attendeeRepository.findOneByOrFail({ attendeeId: id });
  }

  async checkExistence(id: number) {
    const exists = await this.attendeeRepository.existsBy({ attendeeId: id });
    if (!exists) throw new NotFoundException();
  }

  async update(
    attendeeId: number,
    updateAttendeeDto: UpdateAttendeeDto,
    entityManager?: EntityManager,
  ) {
    return entityManager
      ? entityManager.save(Attendee, {
          userId: attendeeId,
          ...updateAttendeeDto,
        })
      : this.attendeeRepository.save({
          userId: attendeeId,
          ...updateAttendeeDto,
        }); // save inserts if doesn't exist
  }

  async remove(id: number) {
    const result = await this.attendeeRepository.delete(id);
    if (!result.affected) throw new NotFoundException();
  }
}
