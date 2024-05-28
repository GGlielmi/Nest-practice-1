import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import {
  IStrategyOptionsWithRequest,
  VerifyFunctionWithRequest,
} from 'passport-local';
import { LoginErrorsService } from 'src/login-errors/services/login-errors.service';
import { UserService } from 'src/user/services/user.service';
import { IncomingMessage } from 'http';

const credentialsStructure = {
  usernameField: 'user',
  passwordField: 'pass',
} as const;

type TCredentials = {
  [K in (typeof credentialsStructure)[keyof typeof credentialsStructure]]: string;
};

export const credentialsKeys: TCredentials = Object.values(
  credentialsStructure,
).reduce((p, c) => ({ ...p, [c]: 'string' }), {} as any);

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(
    private readonly userService: UserService,
    private readonly loginErrorService: LoginErrorsService,
  ) {
    super({
      ...credentialsStructure,
      passReqToCallback: true,
      session: true,
      // secretOrKey: configService.jwtSecret,
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    } as IStrategyOptionsWithRequest);
  }

  async validate(
    req: IncomingMessage,
    username: string,
    pass: string,
    _verified: VerifyFunctionWithRequest, // the same as this validate method (verify is used in plain js)
  ) {
    const user = await this.userService.getByUsername(username);
    if (!user || pass !== user.password) {
      this.logger.warn(
        !user
          ? `User '${username}' doesn't exist`
          : `Invalid credentials for user '${username}'`,
        'AUTHENTICATION FAIL',
      );
      this.loginErrorService
        .create({
          credentials: [username, pass],
          userAgent: req.headers['user-agent'],
          ipAddress:
            req.headers['x-forwarded-for']?.toString() ||
            req.socket.remoteAddress,
        })
        .catch(console.log);
      throw new UnauthorizedException();
    }
    return user; // this is added to `.user` prop of the request
  }
}
