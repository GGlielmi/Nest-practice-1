import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy,
  IStrategyOptionsWithRequest,
  VerifyFunctionWithRequest,
} from 'passport-local';
import { IncomingMessage } from 'http';
import { AuthService } from '../auth.service';

const credentialsStructure = {
  usernameField: 'user',
  passwordField: 'pass',
} as const;

type TCredentials = {
  [K in (typeof credentialsStructure)[keyof typeof credentialsStructure]]: string;
};

export const credentialsKeysSchema: TCredentials = Object.values(
  credentialsStructure,
).reduce((p, c) => ({ ...p, [c]: 'guido' }), {} as any);

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  // strategy only for login (where token is not needed in headers)

  constructor(private readonly authService: AuthService) {
    super({
      ...credentialsStructure,
      passReqToCallback: true,
      session: true,
    } as IStrategyOptionsWithRequest);
  }

  async validate(
    req: IncomingMessage,
    username: string,
    pass: string,
    _verified: VerifyFunctionWithRequest, // the same as this validate method (verify is used in plain js)
  ) {
    return this.authService.validate(req, username, pass, _verified);
  }
}
