import { Module } from '@nestjs/common';
import { LocalStrategy } from './strategies/local.strategy';
import { LoginModule } from 'src/login/login.module';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AttendeesModule } from 'src/attendees/attendees.module';
import { Manufacturer } from 'src/manufacturer/entities/Manufacturer.entity';
import { Attendee } from 'src/attendees/entities/attendee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManufacturerModule } from 'src/manufacturer/manufacturer.module';

@Module({
  imports: [
    LoginModule,
    AttendeesModule,
    ManufacturerModule,
    TypeOrmModule.forFeature([Attendee, Manufacturer]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('config').jwt.secret,
          signOptions: { expiresIn: '24h' },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [LocalStrategy, JwtStrategy, AuthService],
})
export class AuthModule {}
