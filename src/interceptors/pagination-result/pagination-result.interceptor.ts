import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Observable, map } from 'rxjs';
import { FindAllResult } from 'src/helpers/Paginated.dto';
import { RequestPagination } from 'src/mixins/WithPagination.mixin';

@Injectable()
export class PaginationResultInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((reqData): IPaginationResult => {
        if (!(reqData instanceof FindAllResult)) return reqData;

        const { total, resources } = reqData;
        const isGraphQL = context.getType<GqlContextType>() === 'graphql';
        const query: RequestPagination = isGraphQL
          ? GqlExecutionContext.create(context).getArgs().findParams
          : context.switchToHttp().getRequest().query;

        return {
          lastPage: Math.ceil(total / query?.perPage),
          totalCount: total,
          pageNumber: +query?.pageNumber,
          data: resources,
        };
      }),
    );
  }
}
