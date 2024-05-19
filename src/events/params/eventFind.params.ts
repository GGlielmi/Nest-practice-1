import { CreateEventDto } from '../dtos/CreateEvent.dto';
import { PartialType } from '@nestjs/mapped-types';

const getTimeThousandYearsFromNow = () =>
  new Date().getTime() + 1000 * 60 * 60 * 24 * 365.25 * 1000;

export class EventFindParams extends PartialType(CreateEventDto) {
  orderBy: keyof CreateEventDto;
  orderDirection: 'asc' | 'desc';
  whenFrom?: Date = new Date(0);
  whenTo?: Date = new Date(getTimeThousandYearsFromNow());
}
