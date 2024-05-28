import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindUserDto } from '../dto/find-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  findAll(query: FindUserDto) {
    return this.userRepository.find({ where: query });
  }

  async getByUsername(username: string) {
    return this.userRepository.findOneBy({ username });
  }

  async getById(id: number) {
    return this.userRepository.findOneByOrFail({ userId: id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.getById(id);
    return this.userRepository.save(
      this.userRepository.create({
        ...user,
        ...updateUserDto,
      }),
    );
  }

  async remove(id: number) {
    const user = await this.getById(id);
    return this.userRepository.remove(user);
  }
}
