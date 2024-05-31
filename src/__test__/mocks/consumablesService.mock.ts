import { UpdateManufacturerDto } from 'src/manufacturer/dto/update-manufacturer.dto';
import { CreateConsumableDto } from 'src/manufacturer/dto/create-consumable.dto';
import { createConsumableDtoStub } from '../stubs/consumable.stub';

export const ConsumablesServiceMock = jest.fn().mockImplementation(() => {
  return {
    async create(createManufacturerDto: CreateConsumableDto) {
      return { _id: 1, createManufacturerDto };
    },
    findAll() {
      return [[createConsumableDtoStub], 1];
    },
    getById() {
      return createConsumableDtoStub;
    },
    update(updateManufacturerDto: Partial<UpdateManufacturerDto>) {
      return { _id: 1, ...createConsumableDtoStub, ...updateManufacturerDto };
    },
    remove() {},
  };
});
