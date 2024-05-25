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
  create(createConsumableDto: CreateConsumableDto) {
    return this.consumableRepository.save(createConsumableDto);
  }

  findAll(query: FindConsumableDto) {
    return this.consumableRepository.find({ where: query });
  }

  async getById(id: number) {
    return this.consumableRepository.findOneByOrFail({
      consumableId: id,
    });
  }

  async update(id: number, updateConsumableDto: UpdateConsumableDto) {
    const consumable = await this.getById(id);
    return this.consumableRepository.save(
      this.consumableRepository.create({
        ...consumable,
        ...updateConsumableDto,
      }),
    );
  }

  async remove(id: number) {
    const consumable = await this.getById(id);
    return this.consumableRepository.remove(consumable);
  }
}
