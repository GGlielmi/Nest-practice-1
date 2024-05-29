import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { NO_AUTH_METADATA } from 'src/helpers/NoAuthMetadata';

@Injectable()
export class AuthGuardJwt extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const noAuth = this.reflector.get<boolean>(
      NO_AUTH_METADATA,
      context.getHandler(),
    );
    if (noAuth) return true;

    return super.canActivate(context);
  }
}
