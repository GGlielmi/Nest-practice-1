import { CreateConsumableDto } from 'src/manufacturer/dto/create-consumable.dto';
import { createConsumableDtoStub } from '../stubs/consumable.stub';
import { UpdateConsumableDto } from 'src/manufacturer/dto/update-consumable.dto';

export const ConsumablesServiceMock = jest.fn().mockImplementation(() => {
  return {
    async create(createConsumableDto: CreateConsumableDto) {
      return { _id: 1, createConsumableDto };
    },
    findAll() {
      return [[createConsumableDtoStub], 1];
    },
    getById() {
      return createConsumableDtoStub;
    },
    update(updateConsumableDto: Partial<UpdateConsumableDto>) {
      return { _id: 1, ...createConsumableDtoStub, ...updateConsumableDto };
    },
    remove() {},
  };
});
