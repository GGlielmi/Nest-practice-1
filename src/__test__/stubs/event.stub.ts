import { CreateEventDto } from 'src/events/dtos/CreateEvent.dto';
import { Event } from 'src/events/entities/Event.entity';

export const createEventDtoStub: CreateEventDto = {
  cost: 0,
  when: new Date(),
  organizerId: 1,
  name: 'asd',
  minRequiredAge: 0,
  description: 'asd',
  address: 'asd',
  duration: '01:00:00',
};

export const eventDtoStub: Event = {
  ...createEventDtoStub,
  cost: 0,
  eventId: 0,
  organizerId: 0,
  organizer: {} as any,
  eventConsumables: [] as any,
  eventAttendees: [] as any,
  finishDate: new Date(),
  setFinishDate: () => {},
};
