import { Controller } from '@nestjs/common';
import { LoginErrorsService } from '../services/login-errors.service';

@Controller('login-errors')
export class LoginErrorsController {
  constructor(private readonly loginErrorsService: LoginErrorsService) {}
}
