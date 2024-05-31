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
  class FindClass extends Base implements IPagination {
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(perPageMax)
    @ApiProperty({ required: false, default: perPageMax })
    perPage: number = perPageMax;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @ApiProperty({ required: false, default: fromPageDefault })
    pageNumber: number = fromPageDefault;

    get take() {
      return this.perPage;
    }

    get skip() {
      return (this.perPage - 1) * (this.pageNumber - 1);
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
