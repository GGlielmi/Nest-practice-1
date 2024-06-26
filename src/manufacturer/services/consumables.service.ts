import { Injectable } from '@nestjs/common';
import { CreateConsumableDto } from '../dto/create-consumable.dto';
import { UpdateConsumableDto } from '../dto/update-consumable.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Consumable } from '../entities/Consumable.entity';
import { Repository } from 'typeorm';
import { FindConsumableDto } from '../dto/find-consumable.dto';

@Injectable()
export class ConsumablesService {
  constructor(
    @InjectRepository(Consumable)
    private readonly consumableRepository: Repository<Consumable>,
  ) {}
  async create(createConsumableDto: CreateConsumableDto) {
    return this.consumableRepository.save(createConsumableDto);
  }

  findAll(query: FindConsumableDto) {
    return this.consumableRepository.find({ where: query });
  }

  async getById(id: number, manufacturerId: number) {
    return this.consumableRepository.findOneByOrFail({
      consumableId: id,
      manufacturerId,
    });
  }

  async update(
    id: number,
    manufacturerId: number,
    updateConsumableDto: UpdateConsumableDto,
  ) {
    const consumable = await this.getById(id, manufacturerId);
    return this.consumableRepository.save(
      this.consumableRepository.create({
        ...consumable,
        ...updateConsumableDto,
      }),
    );
  }

  async remove(id: number, manufacturerId: number) {
    const consumable = await this.getById(id, manufacturerId);
    return this.consumableRepository.remove(consumable);
  }
}
