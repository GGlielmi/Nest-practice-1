import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy,
  IStrategyOptionsWithRequest,
  VerifyFunctionWithRequest,
} from 'passport-local';
import { LoginService } from 'src/login/services/login.service';
import { IncomingMessage } from 'http';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

const credentialsStructure = {
  usernameField: 'user',
  passwordField: 'pass',
} as const;

type TCredentials = {
  [K in (typeof credentialsStructure)[keyof typeof credentialsStructure]]: string;
};

export const credentialsKeysSchema: TCredentials = Object.values(
  credentialsStructure,
).reduce((p, c) => ({ ...p, [c]: 'string' }), {} as any);

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // service not used to add security for retrieving passwords
    private readonly loginService: LoginService,
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
    const user = await this.userRepository
      .createQueryBuilder('u')
      .addSelect('u.password')
      .where({ username })
      .getOne();
    const passwordsMatched = await bcrypt.compare(pass, user?.password || '');
    const errd = !user || !passwordsMatched;
    this.loginService
      .create({
        credentials: [username, pass],
        userAgent: req.headers['user-agent'],
        ipAddress:
          req.headers['x-forwarded-for']?.toString() ||
          req.socket.remoteAddress,
        failed: errd,
      })
      .catch(console.log);
    if (errd) {
      this.logger.warn(
        !user
          ? `User '${username}' doesn't exist`
          : `Invalid credentials for user '${username}'`,
        'AUTHENTICATION FAIL',
      );
      throw new UnauthorizedException();
    }
    return user; // this is added to `.user` prop of the request
  }
}
