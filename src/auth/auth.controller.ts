import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AuthDto } from './auth.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  @Post('login')
  @UseGuards(AuthGuard('local')) // default value for PassportStrategy
  // it calls the validate method on the class that implements it
  async login(@Body() credentials: AuthDto) {
    return { username: credentials.user, token: 'asdasd' };
  }
}
