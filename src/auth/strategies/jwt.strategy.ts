import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import configuration from 'src/config/configuration';
import { JwtPayload } from 'jsonwebtoken';
import { AttendeesService } from 'src/attendees/services/attendees.service';
import { ManufacturersService } from 'src/manufacturer/services/manufacturer.service';
import { Attendee } from 'src/attendees/entities/attendee.entity';
import { Manufacturer } from 'src/manufacturer/entities/Manufacturer.entity';

const roles = {
  attendee: Attendee.role,
  manufacturer: Manufacturer.role,
} as const;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // strategy to retrieve user, using header's bearer token
  constructor(
    private readonly attendeeService: AttendeesService,
    private readonly manufacturerService: ManufacturersService,
    @Inject(configuration.KEY)
    configService: ConfigType<typeof configuration>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwt.secret,
    });
  }

  async validate(
    payload: JwtPayload & { role: (typeof roles)[keyof typeof roles] },
  ) {
    if (payload.role === roles.attendee) {
      return this.attendeeService.getById(+payload.sub);
    }
    if (payload.role === roles.manufacturer) {
      return this.manufacturerService.getById(+payload.sub);
    }
  }
}
