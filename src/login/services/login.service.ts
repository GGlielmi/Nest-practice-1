import { Injectable } from '@nestjs/common';
import { Login } from '../entities/Login.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLoginDto } from '../dto/create-login.dto';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(Login)
    private readonly loginRepository: Repository<Login>,
  ) {}

  create(createLoginDto: CreateLoginDto) {
    return this.loginRepository.save(createLoginDto);
  }

  async getById(id: number) {
    return this.loginRepository.findOneByOrFail({
      loginId: id,
    });
  }

  async getByUsername(username: string) {
    return this.loginRepository
      .createQueryBuilder('le')
      .where('le.credentials[0] = :username', { username })
      .getMany();
  }
}
