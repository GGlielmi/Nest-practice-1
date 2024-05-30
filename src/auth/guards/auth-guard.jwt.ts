import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import configuration from 'src/config/configuration';
import { NO_AUTH_METADATA } from 'src/decorators/NoAuthMetadata';

@Injectable()
export class AuthGuardJwt extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    @Inject(configuration.KEY)
    private readonly configService: ConfigType<typeof configuration>,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    if (this.configService.environment === 'development') {
      try {
        await super.canActivate(context); //  needs to be executed to populate User in request
      } catch (err) {
        console.log(err);
      }
      return true;
    }
    const noAuth = this.reflector.get<boolean>(
      NO_AUTH_METADATA,
      context.getHandler(),
    );
    if (noAuth) return true;
    return super.canActivate(context) as Promise<boolean>;
  }
}
