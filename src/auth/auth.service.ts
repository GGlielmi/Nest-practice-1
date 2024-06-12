import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { IncomingMessage } from 'http';
import { VerifyFunctionWithRequest } from 'passport-local';
import configuration from 'src/config/configuration';
import { LoginService } from 'src/login/services/login.service';
import { Manufacturer } from 'src/manufacturer/entities/Manufacturer.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    @Inject(configuration.KEY)
    private readonly configService: ConfigType<typeof configuration>,
    @InjectRepository(Manufacturer)
    private readonly manufacturerRepository: Repository<Manufacturer>, // service not used to add security for
    private readonly loginService: LoginService,
  ) {}

  getToken(user: User) {
    return this.jwtService.sign({
      username: user.username,
      sub: user.userId,
      role: user.role,
    });
  }

  async hashPassword(pass: string) {
    const salt = await bcrypt.genSalt(+this.configService.jwt.salt);
    return bcrypt.hash(pass, salt);
  }

  async validate(
    req: IncomingMessage,
    username: string,
    pass: string,
    _verified?: VerifyFunctionWithRequest, // the same as this validate method (verify is used in plain js)
  ) {
    const user: User = await this.manufacturerRepository
      .createQueryBuilder('u')
      .addSelect('u.password')
      .where({ username })
      .getOne();

    if (!user) this.err(`User '${username}' doesn't exist`);

    const passwordsMatched = await bcrypt.compare(pass, user.password);

    this.loginService
      .create({
        credentials: [username, pass],
        userAgent: req.headers['user-agent'],
        ipAddress:
          req.headers['x-forwarded-for']?.toString() ||
          req.socket.remoteAddress,
        failed: !passwordsMatched,
      })
      .catch(console.log);

    if (!passwordsMatched) {
      this.err(`Invalid credentials for user '${username}'`);
    }

    return user; // this is added to `.user` prop of the request
  }

  private err(message: string) {
    this.logger.warn(message, 'AUTHENTICATION FAIL');
    throw new UnauthorizedException();
  }
}
