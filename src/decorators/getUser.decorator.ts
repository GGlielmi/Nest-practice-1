import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { User as UserEntity } from 'src/user/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserEntity => {
    const isGraphQL = ctx.getType<GqlContextType>() === 'graphql';

    const request = isGraphQL
      ? GqlExecutionContext.create(ctx).getContext().req
      : ctx.switchToHttp().getRequest();

    return request.user;
  },
);
