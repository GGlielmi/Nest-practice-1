import { Test, TestingModule } from '@nestjs/testing';
import { ConsumablesService } from './consumables.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Consumable } from '../entities/Consumable.entity';
import { consumableRepository } from 'src/__test__/mocks/consumableRepository.mock';
import { Repository } from 'typeorm';
import { createConsumableDtoStub } from 'src/__test__/stubs/consumable.stub';

describe('ConsumablesService', () => {
  let service: ConsumablesService;
  let repository: Repository<Consumable>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsumablesService,
        {
          provide: getRepositoryToken(Consumable),
          useValue: consumableRepository,
        },
      ],
    }).compile();

    service = module.get<ConsumablesService>(ConsumablesService);
    repository = module.get<Repository<Consumable>>(
      getRepositoryToken(Consumable),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call .save and .create on repository', async () => {
    const saveSpy = jest.spyOn(repository, 'save');

    await service.create(createConsumableDtoStub);

    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(createConsumableDtoStub);
  });
});
