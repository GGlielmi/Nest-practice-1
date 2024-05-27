import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { RequestPagination } from 'src/mixins/WithPagination.mixin';

@Injectable()
export class PaginationResultInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(([data, totalCount]: [any[], number]): IPaginationResult => {
        const { pageNumber, perPage }: RequestPagination = context
          .switchToHttp()
          .getRequest().query;
        return {
          lastPage: Math.ceil(totalCount / perPage),
          totalCount,
          pageNumber: +pageNumber,
          data,
        };
      }),
    );
  }
}
