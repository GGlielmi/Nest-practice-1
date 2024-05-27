import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsIn } from 'class-validator';
import { orderDirection } from 'src/constants/db';
import { FindOptionsOrder } from 'typeorm';

export interface IFindOrderParams<Entity> {
  getOrderParam(): FindOptionsOrder<Entity>;
}

export function WithOrder<
  T extends new (...args: any[]) => any,
  TOrderByKeys extends (keyof InstanceType<T>)[],
>(Base: T, orderByKeys: TOrderByKeys) {
  class OrderClass extends Base implements IFindOrderParams<T> {
    @IsOptional()
    @ApiProperty({
      type: String,
      required: false,
      enum: orderByKeys,
    })
    @IsIn(orderByKeys)
    orderBy?: keyof T;

    @ApiProperty({
      type: String,
      enum: orderDirection,
      default: orderDirection[0],
    })
    @IsOptional()
    @IsIn(orderDirection)
    orderDirection?: TOrderDirection = 'asc';

    getOrderParam(): FindOptionsOrder<InstanceType<T>> {
      return this.orderBy
        ? ({ [this.orderBy]: this.orderDirection } as FindOptionsOrder<
            InstanceType<T>
          >)
        : {};
    }
  }
  return OrderClass;
}
