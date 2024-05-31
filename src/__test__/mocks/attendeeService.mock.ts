import { CreateAttendeeDto } from 'src/attendees/dto/create-attendee.dto';
import { createAttendeeDtoStub } from '../stubs/attendee.stub';
import { UpdateAttendeeDto } from 'src/attendees/dto/update-attendee.dto';

export const AttendeeServiceMock = jest.fn().mockImplementation(() => {
  return {
    async create(createAttendeeDto: CreateAttendeeDto) {
      return { _id: 1, createAttendeeDto };
    },
    findAll() {
      return [[createAttendeeDtoStub], 1];
    },
    getById() {
      return createAttendeeDtoStub;
    },
    checkExistence() {
      return true;
    },
    update(updateAttendeeDto: Partial<UpdateAttendeeDto>) {
      return { _id: 1, ...createAttendeeDtoStub, ...updateAttendeeDto };
    },
    remove() {},
  };
});
