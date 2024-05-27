import { Test, TestingModule } from '@nestjs/testing';
import { ManufacturerController } from './manufacturer.controller';
import { ManufacturersService } from '../services/manufacturer.service';

describe('ManufacturerController', () => {
  let controller: ManufacturerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManufacturerController],
      providers: [ManufacturersService],
    }).compile();

    controller = module.get<ManufacturerController>(ManufacturerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
