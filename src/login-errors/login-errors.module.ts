import { Module } from '@nestjs/common';
import { LoginErrorsService } from './services/login-errors.service';
import { LoginErrorsController } from './controllers/login-errors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginError } from './entities/LoginError.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LoginError])],
  controllers: [LoginErrorsController],
  providers: [LoginErrorsService],
  exports: [LoginErrorsService],
})
export class LoginErrorsModule {}
