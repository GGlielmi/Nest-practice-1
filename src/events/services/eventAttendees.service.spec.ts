import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { consumableRepository } from 'src/__test__/mocks/consumableRepository.mock';
import { Repository } from 'typeorm';
import { EventAttendeeService } from './eventAttendees.service';
import { EventAttendee } from '../entities/EventAttendee.entity';

describe('EventAttendeeService', () => {
  let service: EventAttendeeService;
  let repository: Repository<EventAttendee>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventAttendeeService,
        {
          provide: getRepositoryToken(EventAttendee),
          useValue: consumableRepository,
        },
      ],
    }).compile();

    service = module.get<EventAttendeeService>(EventAttendeeService);
    repository = module.get<Repository<EventAttendee>>(
      getRepositoryToken(EventAttendee),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
