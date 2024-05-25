import { Injectable, NotFoundException } from '@nestjs/common';
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

  private async findById(id: number) {
    return this.consumableRepository.findBy({
      consumableId: id,
    });
  }

  async getById(id: number) {
    const consumable = await this.findById(id);
    if (!consumable) throw new NotFoundException();
    return consumable;
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
