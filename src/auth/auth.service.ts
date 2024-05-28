import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  getToken(user: User) {
    return this.jwtService.sign({ username: user.username, sub: user.userId });
  }
}
