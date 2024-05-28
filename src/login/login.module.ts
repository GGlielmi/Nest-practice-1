import { Module } from '@nestjs/common';
import { LoginService } from './services/login.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Login } from './entities/Login.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Login])],
  providers: [LoginService],
  exports: [LoginService],
})
export class LoginModule {}
