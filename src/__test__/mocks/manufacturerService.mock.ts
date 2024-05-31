import { CreateManufacturerDto } from 'src/manufacturer/dto/create-manufacturer.dto';
import { UpdateManufacturerDto } from 'src/manufacturer/dto/update-manufacturer.dto';
import { createManufacturerDtoStub } from '../stubs/manufacturer.stub';

export const ManufacturerServiceMock = jest.fn().mockImplementation(() => {
  return {
    async create(createManufacturerDto: CreateManufacturerDto) {
      return { _id: 1, createManufacturerDto };
    },
    findAll() {
      return [[createManufacturerDtoStub], 1];
    },
    getById() {
      return createManufacturerDtoStub;
    },
    update(updateManufacturerDto: Partial<UpdateManufacturerDto>) {
      return { _id: 1, ...createManufacturerDtoStub, ...updateManufacturerDto };
    },
    remove() {},
    addConsumableToEvent() {},
    removeConsumableFromEvent() {},
  };
});
