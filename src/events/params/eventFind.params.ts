import { CreateEventDto } from '../dtos/CreateEvent.dto';
import { PartialType } from '@nestjs/mapped-types';
import { FindParam } from 'src/helpers/findParams';

const getTimeThousandYearsFromNow = () =>
  new Date().getTime() + 1000 * 60 * 60 * 24 * 365.25 * 1000;

export class EventFindParams extends FindParam(PartialType(CreateEventDto)) {
  whenFrom = new Date(0);
  whenTo = new Date(getTimeThousandYearsFromNow());
}
