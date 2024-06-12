import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min, Max } from 'class-validator';

export interface RequestPagination {
  perPage: number;
  pageNumber: number;
}

interface IPagination extends RequestPagination {
  take: number;
  skip: number;
  limit: number;
  offset: number;
}

export function WithPagination<T extends new (...args: any[]) => any>(
  Base: T,
  perPageMax = 10,
  fromPageDefault = 1,
) {
  @InputType({ isAbstract: true })
  class FindClass extends Base implements IPagination {
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(perPageMax)
    @ApiProperty({ required: false, default: perPageMax })
    @Field({ nullable: true })
    perPage: number = perPageMax;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @ApiProperty({ required: false, default: fromPageDefault })
    @Field({ nullable: true })
    pageNumber: number = fromPageDefault;

    get take() {
      return this.perPage;
    }

    get skip() {
      return this.perPage * (this.pageNumber - 1);
    }

    get limit() {
      return this.take;
    }

    get offset() {
      return this.skip;
    }
  }
  return FindClass;
}
