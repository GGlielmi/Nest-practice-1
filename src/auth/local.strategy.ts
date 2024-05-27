import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-local';
import { LoginErrorsService } from 'src/login-errors/services/login-errors.service';
import { UserService } from 'src/user/services/user.service';

const credentialsStructure = {
  usernameField: 'user',
  passwordField: 'pass',
} as const;

type TCredentials = {
  [K in (typeof credentialsStructure)[keyof typeof credentialsStructure]]: string;
};

type TCredentialsStructure = typeof credentialsStructure;

interface IPassportLocalArgs extends TCredentialsStructure {
  passReqToCallback?: boolean;
}

export interface ICredentials extends TCredentials {}

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
    } as IPassportLocalArgs);
  }

  async validate(req: Request, username: string, pass: string) {
    const user = await this.userService.getByUsername(username);
    if (pass !== user.password) {
      this.logger.warn(`Invalid credentials for user '${username}'`);
      await this.loginErrorService
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
    return user;
  }
}
