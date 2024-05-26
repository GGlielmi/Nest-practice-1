import { orderDirection } from 'src/constants/db';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { CreateEventDto } from '../dtos/CreateEvent.dto';
import { Between, ILike, In } from 'typeorm';
import { Event } from '../entities/Event.entity';
import { IFindParams } from 'src/interfaces/IFindParams';

const eventDtoKeys = Object.keys(new CreateEventDto());
const getTimeThousandYearsFromNow = () =>
  new Date().getTime() + 1000 * 60 * 60 * 24 * 365.25 * 1000;

class _BaseEventFindParams
  extends CreateEventDto
  implements IFindParams<Event>
{
  getWhereParams() {
    return {
      ...this,
      ...(this.description && {
        description: ILike(`%${this.description}%`),
      }),
    };
  }

  getOrderParam() {
    return {};
  }
}

class _EventFindParams extends _BaseEventFindParams {
  @IsNumber({}, { each: true })
  eventIds?: number[];

  @ApiProperty({ type: String, required: false })
  whenFrom?: Date;

  @ApiProperty({ type: String, required: false })
  whenTo?: Date;

  @Min(0)
  @Max(1_000_000)
  minCost?: number;

  @Min(0)
  @Max(1_000_000)
  maxCost?: number;

  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    enum: eventDtoKeys,
  })
  @IsIn(eventDtoKeys)
  orderBy?: keyof CreateEventDto;

  @ApiProperty({
    type: String,
    required: true,
    enum: orderDirection,
    default: orderDirection[0],
  })
  @IsOptional()
  @IsIn(orderDirection)
  orderDirection?: TOrderDirection = 'asc';

  getWhereParams() {
    return {
      ...super.getWhereParams(),
      ...(this.eventIds && { eventId: In(this.eventIds) }),
      ...((this.whenFrom || this.whenTo) && {
        when: Between(
          this.whenFrom || new Date(0),
          this.whenTo || new Date(getTimeThousandYearsFromNow()),
        ),
      }),
      ...((this.minCost || this.maxCost) && {
        cost: Between(this.minCost, this.maxCost),
      }),
    };
  }

  getOrderParam() {
    return this.orderBy ? { [this.orderBy]: this.orderDirection } : {};
  }
}

export class EventFindParams extends PartialType(_EventFindParams) {}
