import { Injectable } from '@nestjs/common';
import { LoginError } from '../entities/LoginError.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLoginErrorDto } from '../dto/create-login-error.dto';

@Injectable()
export class LoginErrorsService {
  constructor(
    @InjectRepository(LoginError)
    private readonly loginErrorRepository: Repository<LoginError>,
  ) {}

  create(createLoginErrorDto: CreateLoginErrorDto) {
    return this.loginErrorRepository.save(createLoginErrorDto);
  }

  async getById(id: number) {
    return this.loginErrorRepository.findOneByOrFail({
      loginErrorId: id,
    });
  }

  async getByUsername(username: string) {
    return this.loginErrorRepository
      .createQueryBuilder('le')
      .where('le.credentials[0] = :username', { username })
      .getMany();
  }
}
