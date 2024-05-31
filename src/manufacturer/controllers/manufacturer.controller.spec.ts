import { Test, TestingModule } from '@nestjs/testing';
import { ManufacturerController } from './manufacturer.controller';
import { ManufacturersService } from '../services/manufacturer.service';
import { ConsumablesService } from '../services/consumables.service';
import { ConsumablesServiceMock } from 'src/__test__/mocks/consumablesService.mock';
import { createConsumableDtoStub } from 'src/__test__/stubs/consumable.stub';
import { ManufacturersServiceMock } from 'src/__test__/mocks/manufacturersService.mock';
import { FindConsumableDto } from '../dto/find-consumable.dto';
import { ConsumableType } from '../entities/Consumable.entity';

describe('ManufacturerController', () => {
  let controller: ManufacturerController;
  let consumablesService: ConsumablesService;
  let manufacturersService: ManufacturersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManufacturerController],
      providers: [
        { provide: ConsumablesService, useClass: ConsumablesServiceMock },
        { provide: ManufacturersService, useClass: ManufacturersServiceMock },
      ],
    }).compile();

    controller = module.get<ManufacturerController>(ManufacturerController);
    consumablesService = module.get<ConsumablesService>(ConsumablesService);
    manufacturersService =
      module.get<ManufacturersService>(ManufacturersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Consumables', () => {
    it('should call .create on consumablesService', () => {
      const createSpy = jest.spyOn(consumablesService, 'create');

      controller.createConsumable(createConsumableDtoStub);

      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(createSpy).toHaveBeenCalledWith(createConsumableDtoStub);
    });
    it('should call .findAllConsumables on consumablesService with provided query', () => {
      const createSpy = jest.spyOn(consumablesService, 'findAll');

      const findAllConsumablesQuery = {
        cost: 1,
        brand: 'asd',
        type: ConsumableType.SOUVENIR,
      };

      controller.findAllConsumables(findAllConsumablesQuery);

      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(createSpy).toHaveBeenCalledWith(findAllConsumablesQuery);
    });
  });
});
