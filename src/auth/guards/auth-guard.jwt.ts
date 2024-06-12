import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import configuration from 'src/config/configuration';
import { NO_AUTH_METADATA } from 'src/decorators/NoAuthMetadata';
import { JwtStrategy } from '../strategies/jwt.strategy';

@Injectable()
export class AuthGuardJwt extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtStrategyService: JwtStrategy,
    private readonly jwtService: JwtService,
    @Inject(configuration.KEY)
    private readonly configService: ConfigType<typeof configuration>,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const isGraphQL = context.getType<GqlContextType>() === 'graphql';

    const currentContext = isGraphQL
      ? GqlExecutionContext.create(context)
      : context;

    const noAuth = this.reflector.get<boolean>(
      NO_AUTH_METADATA,
      currentContext.getHandler(),
    );

    if (noAuth) return true;

    if (this.configService.environment === 'development') {
      const req: Request = isGraphQL
        ? (currentContext as GqlExecutionContext).getContext().req
        : currentContext.switchToHttp().getRequest();

      const payload = this.jwtService.decode(
        req.headers.authorization.slice(7),
      );

      req.user = await this.jwtStrategyService.validate(payload);
      return true;
    }
    return super.canActivate(currentContext) as Promise<boolean>;
  }

  getRequest(context: ExecutionContext) {
    const isGraphQL =
      context instanceof GqlExecutionContext &&
      context.getType<GqlContextType>() === 'graphql';

    const req = isGraphQL
      ? context.getContext().req
      : super.getRequest(context);

    return req;
  }
}
