import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { AttendeesService } from '../../attendees/services/attendees.service';
import { ManufacturersService } from '../../manufacturer/services/manufacturer.service';
import { createAttendeeDtoStub } from '../../__test__/stubs/attendee.stub';
import { AttendeeServiceMock } from '../../__test__/mocks/attendeeService.mock';
import { ManufacturerServiceMock } from '../../__test__/mocks/manufacturerService.mock';
import { createManufacturerDtoStub } from 'src/__test__/stubs/manufacturer.stub';

describe('UserController', () => {
  let controller: UserController;
  let attendeesService: AttendeesService;
  let manufacturersService: ManufacturersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: AttendeesService, useClass: AttendeeServiceMock },
        { provide: ManufacturersService, useClass: ManufacturerServiceMock },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    attendeesService = module.get<AttendeesService>(AttendeesService);
    manufacturersService =
      module.get<ManufacturersService>(ManufacturersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call .create on attendeesService', () => {
    const createSpy = jest.spyOn(attendeesService, 'create');

    controller.createAttendee(createAttendeeDtoStub);

    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(createSpy).toHaveBeenCalledWith(createAttendeeDtoStub);
  });

  it('should call .create on manufacturersService', () => {
    const createSpy = jest.spyOn(manufacturersService, 'create');

    controller.createManufacturer(createManufacturerDtoStub);

    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(createSpy).toHaveBeenCalledWith(createManufacturerDtoStub);
  });
});
