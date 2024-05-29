import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { credentialsKeysSchema } from './strategies/local.strategy';
import { User as UserEntity } from 'src/user/entities/user.entity';
import { CurrentUser } from 'src/decorators/getUser.decorator';
import { AuthGuardLocal } from './guards/auth-guard.local';
import { NoAuth } from 'src/helpers/NoAuthMetadata';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @NoAuth()
  @ApiBody({ schema: { example: credentialsKeysSchema } })
  @UseGuards(AuthGuardLocal)
  async login(@CurrentUser() user: UserEntity) {
    return {
      userId: user.userId,
      token: this.authService.getToken(user),
    };
  }
}
