import { Test, TestingModule } from '@nestjs/testing';
import { ManufacturersService } from '../services/manufacturer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { consumableRepository } from 'src/__test__/mocks/consumableRepository.mock';
import { Repository } from 'typeorm';
import { Manufacturer } from '../entities/Manufacturer.entity';
import { createManufacturerDtoStub } from 'src/__test__/stubs/manufacturer.stub';
import { EventsService } from 'src/events/services/events.service';
import { ConsumablesService } from './consumables.service';
import { ConsumablesServiceMock } from 'src/__test__/mocks/consumablesService.mock';
import { ManufacturersServiceMock } from 'src/__test__/mocks/manufacturersService.mock';

describe('ManufacturerService', () => {
  let service: ManufacturersService;
  let repository: Repository<Manufacturer>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ManufacturersService,
        {
          provide: getRepositoryToken(Manufacturer),
          useValue: consumableRepository,
        },
        { provide: ConsumablesService, useClass: ConsumablesServiceMock },
        { provide: EventsService, useClass: ManufacturersServiceMock },
      ],
    }).compile();

    service = module.get<ManufacturersService>(ManufacturersService);
    repository = module.get<Repository<Manufacturer>>(
      getRepositoryToken(Manufacturer),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call .save and .create on repository', async () => {
    const createSpy = jest.spyOn(repository, 'create');
    const saveSpy = jest.spyOn(repository, 'save');

    await service.create(createManufacturerDtoStub);

    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(createSpy).toHaveBeenCalledWith(createManufacturerDtoStub);
    expect(saveSpy).toHaveBeenCalledTimes(1);
  });
});
