import { Module } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';
import { UserModule } from 'src/user/user.module';
import { LoginErrorsModule } from 'src/login-errors/login-errors.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [UserModule, LoginErrorsModule],
  controllers: [AuthController],
  providers: [LocalStrategy],
})
export class AuthModule {}
