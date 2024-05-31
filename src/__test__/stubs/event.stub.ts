import { CreateEventDto } from 'src/events/dtos/CreateEvent.dto';

export const createEventDtoStub: CreateEventDto = {
  cost: 1,
  when: new Date(),
  organizerId: 1,
  name: 'asd',
  minRequiredAge: 10,
  description: 'asd',
  address: 'asd',
};
