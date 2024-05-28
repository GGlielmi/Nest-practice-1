import { Module } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';
import { LoginModule } from 'src/login/login.module';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    LoginModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('config').jwt.secret,
          signOptions: { expiresIn: '60m' },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [LocalStrategy, AuthService],
})
export class AuthModule {}
