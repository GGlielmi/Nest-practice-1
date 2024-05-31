import { CreateEventDto } from 'src/events/dtos/CreateEvent.dto';
import { UpdateEventDto } from 'src/events/dtos/UpdateEvent.dto';
import { createEventDtoStub } from '../stubs/event.stub';

export const EventsServiceMock = jest.fn().mockImplementation(() => {
  return {
    async create(createEventDto: CreateEventDto) {
      return { _id: 1, createEventDto };
    },
    findAll() {
      return [[createEventDtoStub], 1];
    },
    getById() {
      return createEventDtoStub;
    },
    update(updateEventDto: Partial<UpdateEventDto>) {
      return { _id: 1, ...createEventDtoStub, ...updateEventDto };
    },
    remove() {},
  };
});
