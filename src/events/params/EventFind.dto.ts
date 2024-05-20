import { orderDirection } from 'src/constants/db';
import { CreateEventDto } from '../dtos/CreateEvent.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsIn, IsOptional, Max, Min } from 'class-validator';

const eventDtoKeys = Object.keys(new CreateEventDto());

const getTimeThousandYearsFromNow = () =>
  new Date().getTime() + 1000 * 60 * 60 * 24 * 365.25 * 1000;

export class EventFindParams extends PartialType(CreateEventDto) {
  @ApiProperty({ type: String, required: false })
  whenFrom = new Date(0);

  @ApiProperty({ type: String, required: false })
  whenTo = new Date(getTimeThousandYearsFromNow());

  @Min(0)
  @Max(1_000_000)
  maxCost?: number = 1_000_000;

  @Min(0)
  @Max(1_000_000)
  minCost?: number = 0;

  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    enum: eventDtoKeys,
  })
  @IsIn(eventDtoKeys)
  orderBy: keyof CreateEventDto;

  @ApiProperty({
    type: String,
    required: true,
    enum: orderDirection,
    default: orderDirection[0],
  })
  @IsOptional()
  @IsIn(orderDirection)
  orderDirection?: TOrderDirection;
}
