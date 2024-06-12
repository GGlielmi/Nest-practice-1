import { Type } from '@nestjs/common';
import { ObjectType, Field, Int } from '@nestjs/graphql';

export function Paginated<T>(classRef: Type<T>): Type<IPaginationResult<T>> {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType implements IPaginationResult<T> {
    @Field(() => Int)
    pageNumber: number;

    @Field(() => Int)
    totalCount: number;

    @Field()
    lastPage: number;

    @Field(() => [classRef], { nullable: 'items' })
    data: T[];
  }
  return PaginatedType as Type<IPaginationResult<T>>;
}
