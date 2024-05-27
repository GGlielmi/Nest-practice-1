import { Test, TestingModule } from '@nestjs/testing';
import { LoginErrorsController } from './login-errors.controller';
import { LoginErrorsService } from '../services/login-errors.service';

describe('LoginErrorsController', () => {
  let controller: LoginErrorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginErrorsController],
      providers: [LoginErrorsService],
    }).compile();

    controller = module.get<LoginErrorsController>(LoginErrorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
