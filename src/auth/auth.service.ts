import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import configuration from 'src/config/configuration';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(configuration.KEY)
    private readonly configService: ConfigType<typeof configuration>,
  ) {}

  getToken(user: User) {
    return this.jwtService.sign({ username: user.username, sub: user.userId });
  }

  async hashPassword(pass: string) {
    const salt = await bcrypt.genSalt(+this.configService.jwt.salt);
    return bcrypt.hash(pass, salt);
  }
}
