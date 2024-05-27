import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
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

export interface ICredentials extends TCredentials {}

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(
    private readonly userService: UserService,
    private readonly loginErrorService: LoginErrorsService,
  ) {
    super(credentialsStructure);
  }

  async validate(username: string, pass: string) {
    const user = await this.userService.getByUsername(username);
    if (pass !== user.password) {
      this.logger.warn(`Invalid credentials for user '${username}'`);
      await this.loginErrorService
        .create({ credentials: [username, pass] })
        .catch(console.log);
      throw new UnauthorizedException();
    }
    return user;
  }
}

// julian, abe, giuli, lourdes, polo
