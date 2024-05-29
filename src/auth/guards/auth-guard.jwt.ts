import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import configuration from 'src/config/configuration';
import { NO_AUTH_METADATA } from 'src/helpers/NoAuthMetadata';

@Injectable()
export class AuthGuardJwt extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    @Inject(configuration.KEY)
    private readonly configService: ConfigType<typeof configuration>,
  ) {
    super();
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (this.configService.environment === 'development') return true;
    const noAuth = this.reflector.get<boolean>(
      NO_AUTH_METADATA,
      context.getHandler(),
    );
    if (noAuth) return true;
    return super.canActivate(context);
  }
}
