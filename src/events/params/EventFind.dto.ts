import { orderDirection } from 'src/constants/db';
import { CreateEventDto } from '../dtos/CreateEvent.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';

const getTimeThousandYearsFromNow = () =>
  new Date().getTime() + 1000 * 60 * 60 * 24 * 365.25 * 1000;

export class EventFindParams extends PartialType(CreateEventDto) {
  @ApiProperty({ type: String, required: false })
  whenFrom = new Date(0);

  @ApiProperty({ type: String, required: false })
  whenTo = new Date(getTimeThousandYearsFromNow());

  @ApiProperty({
    type: String,
    required: false,
    enum: Object.keys(new CreateEventDto()),
  })
  orderBy: keyof CreateEventDto;

  @ApiProperty({
    type: String,
    required: true,
    enum: orderDirection,
    default: orderDirection[0],
  })
  orderDirection: TOrderDirection;
}
