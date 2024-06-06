import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';
import { createAttendeeDtoStub } from 'src/__test__/stubs/attendee.stub';
import { createEventDtoStub } from 'src/__test__/stubs/event.stub';
import { Attendee } from 'src/attendees/entities/attendee.entity';
import { AttendeesService } from 'src/attendees/services/attendees.service';
import config from 'src/config/configuration';
import responseMessages from 'src/constants/responseMessages';
import { DataSource, QueryFailedError } from 'typeorm';
import { Event } from '../entities/Event.entity';
import { EventAttendee } from '../entities/EventAttendee.entity';
import { EventConsumable } from '../entities/EventConsumable.entity';
import { EventAttendeeService } from './eventAttendees.service';
import { EventConsumableService } from './eventConsumables.service';
import { EventsService } from './events.service';
import { ConfigModule } from '@nestjs/config';
import { Consumable } from 'src/manufacturer/entities/Consumable.entity';
import { Manufacturer } from 'src/manufacturer/entities/Manufacturer.entity';
import { Organizer } from 'src/organizers/entities/Organizer.entity';
import { OrganizersService } from 'src/organizers/services/organizers.service';
import { createOrganizerDtoStub } from 'src/__test__/stubs/organizer.stub';
import { ATTENDEE_INSSUFICIENT_FUNDS_CONSTRAINT } from 'src/constants/constraints';

describe('EventsService', () => {
  let eventService: EventsService;
  let organizersService: OrganizersService;
  let attendeesService: AttendeesService;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [config],
          expandVariables: true,
        }),
        TypeOrmModule.forRootAsync({
          useFactory: () => {
            const { database } = config();
            return {
              ...database,
              dropSchema: true, // deletes everything on connection
              database: database.databaseTest,
              type: 'postgres',
              // logging: true,
              entities: [
                Attendee,
                Consumable,
                Event,
                EventAttendee,
                EventConsumable,
                Manufacturer,
                Organizer,
              ],
              synchronize: true,
            };
          },
        }),
        TypeOrmModule.forFeature([
          Event,
          EventAttendee,
          EventConsumable,
          Attendee,
          Organizer,
        ]),
      ],
      providers: [
        EventsService,
        OrganizersService,
        AttendeesService,
        EventAttendeeService,
        EventConsumableService,
      ],
    }).compile();
    eventService = module.get<EventsService>(EventsService);
    attendeesService = module.get<AttendeesService>(AttendeesService);
    organizersService = module.get<OrganizersService>(OrganizersService);

    dataSource = module.get<DataSource>(getDataSourceToken('default'));
  });

  beforeEach(async () => {
    if (!dataSource.isInitialized) await dataSource.initialize();
  });

  afterEach(async () => {
    await dataSource.destroy();
  });

  it('should be defined', () => {
    expect(eventService).toBeDefined();
  });

  it('should throw err when the attendee is underaged', async () => {
    // lo que se tendria que lograr es que al inyectar el repo, ese mismo repo elija el EntityManager
    try {
      const createdOrganizer = await organizersService.create(
        createOrganizerDtoStub,
      );

      const createdEvent = await eventService.create({
        ...createEventDtoStub,
        organizerId: createdOrganizer.userId,
        minRequiredAge: 10,
      });
      const createdAttendee = await attendeesService.create({
        ...createAttendeeDtoStub,
        age: createdEvent.minRequiredAge - 1,
      });
      await eventService.addAttendeeToEvent(
        createdAttendee.attendeeId,
        createdEvent.eventId,
        createdOrganizer.userId,
      );
    } catch (err) {
      expect(err.message).toBe(responseMessages.events.attendeeUnderaged);
    }
  });

  it("should throw err when the attendee doesn't have enough funds", async () => {
    // lo que se tendria que lograr es que al inyectar el repo, ese mismo repo elija el EntityManager
    try {
      const createdOrganizer = await organizersService.create(
        createOrganizerDtoStub,
      );

      const createdEvent = await eventService.create({
        ...createEventDtoStub,
        organizerId: createdOrganizer.userId,
        cost: 10,
      });
      const createdAttendee = await attendeesService.create({
        ...createAttendeeDtoStub,
        funds: createdEvent.cost - 1,
      });
      await eventService.addAttendeeToEvent(
        createdAttendee.attendeeId,
        createdEvent.eventId,
        createdOrganizer.userId,
      );
    } catch (err) {
      expect(err.driverError.constraint).toBe(
        ATTENDEE_INSSUFICIENT_FUNDS_CONSTRAINT.constraint,
      );
    }
  });

  // it("should throw err when the attendee doesn't have enough funds", async () => {
  //   const event = new Event({ ...createEventDtoStub, cost: 12 });
  //   const attendee = new Attendee({
  //     ...createAttendeeDtoStub,
  //     funds: event.cost - 1,
  //   });

  //   jest.spyOn(service, 'getById').mockImplementation(async () => event);
  //   jest
  //     .spyOn(attendeesService, 'getById')
  //     .mockImplementation(async () => attendee);

  //   try {
  //     await service.addAttendeeToEvent(0, 0, 0);
  //   } catch (err) {
  //     expect(err.message).toBe(
  //       responseMessages.events.attendeeInsufficientFunds,
  //     );
  //   }
  // });

  // it("should throw err when the attendee doesn't pass the minimum required age", async () => {
  //   const event = new Event({ ...createEventDtoStub, minRequiredAge: 12 });
  //   const attendee = new Attendee({
  //     ...createAttendeeDtoStub,
  //     age: event.minRequiredAge - 1,
  //   });

  //   jest.spyOn(service, 'getById').mockImplementation(async () => event);
  //   jest
  //     .spyOn(attendeesService, 'getById')
  //     .mockImplementation(async () => attendee);

  //   try {
  //     await service.addAttendeeToEvent(0, 0, 0);
  //   } catch (err) {
  //     expect(err.message).toBe(responseMessages.events.attendeeUnderaged);
  //   }
  // });
});
