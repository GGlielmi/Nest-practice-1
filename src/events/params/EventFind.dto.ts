import { orderDirection } from 'src/constants/db';
import { ApiProperty } from '@nestjs/swagger';
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
import { Field, InputType, PartialType } from '@nestjs/graphql';

const eventDtoKeys = Object.keys(new CreateEventDto());

const getTimeThousandYearsFromNow = () =>
  new Date().getTime() + 1000 * 60 * 60 * 24 * 365.25 * 1000;

@InputType({ isAbstract: true })
class _EventFindParams
  extends PartialType(CreateEventDto)
  implements IWhereParams<Event>
{
  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  cost?: number;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  duration?: string;

  @Field({ nullable: true })
  minRequiredAge?: number;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  organizerId?: number;

  @Field({ nullable: true })
  when?: Date;

  @IsOptional()
  @IsNumber({}, { each: true })
  @Field(() => [Number], { nullable: true })
  eventIds?: number[];

  @IsOptional()
  @ApiProperty({ type: String, required: false })
  @Field({ nullable: true })
  whenFrom?: Date;

  @IsOptional()
  @ApiProperty({ type: String, required: false })
  @Field({ nullable: true })
  whenTo?: Date;

  @IsOptional()
  @Min(0)
  @Max(1_000_000)
  @Field({ nullable: true })
  minCost?: number;

  @IsOptional()
  @Min(0)
  @Max(1_000_000)
  @Field({ nullable: true })
  maxCost?: number;

  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    enum: eventDtoKeys,
  })
  @IsIn(eventDtoKeys)
  @Field(() => String, { nullable: true })
  orderBy?: keyof CreateEventDto;

  @ApiProperty({
    type: String,
    enum: orderDirection,
    default: orderDirection[0],
  })
  @IsOptional()
  @IsIn(orderDirection)
  @Field(() => String, { nullable: true })
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

@InputType()
export class EventFindParams extends WithOrder(
  WithPagination(_EventFindParams),
  eventDtoKeys,
) {}
