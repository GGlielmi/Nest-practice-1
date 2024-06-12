import { Injectable } from '@nestjs/common';
import { CreateOrganizerDto } from '../dto/create-organizer.dto';
import { UpdateOrganizerDto } from '../dto/update-organizer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organizer } from '../entities/Organizer.entity';
import { FindOrganizerDto } from '../dto/find-organizer-dto';

@Injectable()
export class OrganizersService {
  constructor(
    @InjectRepository(Organizer)
    private readonly organizerRepository: Repository<Organizer>,
  ) {}

  async create(createOrganizerDto: CreateOrganizerDto) {
    const organizer = await this.organizerRepository.save(
      this.organizerRepository.create(createOrganizerDto),
    );
    return organizer.userId;
  }

  findAll(query: FindOrganizerDto) {
    return this.organizerRepository.find({ where: query });
  }

  async getById(id: number) {
    return this.organizerRepository.findOneByOrFail({
      userId: id,
    });
  }

  async update(id: number, updateOrganizerDto: UpdateOrganizerDto) {
    const organizer = await this.getById(id);
    return this.organizerRepository.save(
      this.organizerRepository.create({
        ...organizer,
        ...updateOrganizerDto,
      }),
    );
  }

  async remove(id: number) {
    const organizer = await this.getById(id);
    return this.organizerRepository.remove(organizer);
  }
}
