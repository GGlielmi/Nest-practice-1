import { Test, TestingModule } from '@nestjs/testing';
import { LoginErrorsService } from './login-errors.service';

describe('LoginErrorsService', () => {
  let service: LoginErrorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoginErrorsService],
    }).compile();

    service = module.get<LoginErrorsService>(LoginErrorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
