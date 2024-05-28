import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { User } from 'src/user/entities/user.entity';
import { credentialsKeys } from './local.strategy';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiBody({ schema: { example: credentialsKeys } })
  @UseGuards(AuthGuard('local')) // 'local' is default value for PassportStrategy
  // it calls the validate method on the class that implements it
  async login(@Req() req: { user: User }) {
    return {
      userId: req.user.userId,
      token: this.authService.getToken(req.user),
    };
  }
}
