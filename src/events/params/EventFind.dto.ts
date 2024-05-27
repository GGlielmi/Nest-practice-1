import { orderDirection } from 'src/constants/db';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { CreateEventDto } from '../dtos/CreateEvent.dto';
import {
  Between,
  FindOptionsOrder,
  FindOptionsWhere,
  ILike,
  In,
} from 'typeorm';
import { Event } from '../entities/Event.entity';
import { IWhereParams } from 'src/interfaces/IFindParams';
import { WithOrder } from 'src/mixins/WithOrder.mixin';
import { WithPagination } from 'src/mixins/WithPagination.mixin';

const eventDtoKeys = Object.keys(new CreateEventDto());

const getTimeThousandYearsFromNow = () =>
  new Date().getTime() + 1000 * 60 * 60 * 24 * 365.25 * 1000;

class _EventFindParams
  extends PartialType(CreateEventDto)
  implements IWhereParams<Event>
{
  @IsOptional()
  @IsNumber({}, { each: true })
  eventIds?: number[];

  @IsOptional()
  @ApiProperty({ type: String, required: false })
  whenFrom?: Date;

  @IsOptional()
  @ApiProperty({ type: String, required: false })
  whenTo?: Date;

  @IsOptional()
  @Min(0)
  @Max(1_000_000)
  minCost?: number;

  @IsOptional()
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
    enum: orderDirection,
    default: orderDirection[0],
  })
  @IsOptional()
  @IsIn(orderDirection)
  orderDirection?: TOrderDirection = 'asc';

  getWhereParams(): FindOptionsWhere<Event> {
    return {
      ...(this.address && { address: this.address }),
      ...(this.cost && { cost: this.cost }),
      ...(this.name && { name: this.name }),
      ...(this.when && { when: this.when }),
      ...(this.minRequiredAge && { minRequiredAge: this.minRequiredAge }),
      ...(this.description && {
        description: ILike(`%${this.description}%`),
      }),
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

  getOrderParam(): FindOptionsOrder<Event> {
    return this.orderBy ? { [this.orderBy]: this.orderDirection } : {};
  }
}

export class EventFindParams extends WithOrder(
  WithPagination(_EventFindParams, 2, 2),
  eventDtoKeys,
) {}
