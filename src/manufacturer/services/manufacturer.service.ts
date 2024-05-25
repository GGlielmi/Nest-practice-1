import { Injectable } from '@nestjs/common';
import { CreateManufacturerDto } from '../dto/create-manufacturer.dto';
import { UpdateManufacturerDto } from '../dto/update-manufacturer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Manufacturer } from '../entities/manufacturer.entity';
import { Repository } from 'typeorm';
import { FindManufacturerDto } from '../dto/find-manufacturer.dto';
import { ConsumablesService } from 'src/consumables/services/consumables.service';
import { EventsService } from 'src/events/services/events.service';

@Injectable()
export class ManufacturerService {
  constructor(
    @InjectRepository(Manufacturer)
    private readonly manufacturerRepository: Repository<Manufacturer>,
    private readonly consumableService: ConsumablesService,
    private readonly eventService: EventsService,
  ) {}

  create(createConsumableDto: CreateManufacturerDto) {
    return this.manufacturerRepository.save(createConsumableDto);
  }

  findAll(query: FindManufacturerDto) {
    return this.manufacturerRepository.find({ where: query });
  }

  async getById(id: number) {
    return this.manufacturerRepository.findOneByOrFail({
      manufacturerId: id,
    });
  }

  async update(id: number, updateConsumableDto: UpdateManufacturerDto) {
    const consumable = await this.getById(id);
    return this.manufacturerRepository.save(
      this.manufacturerRepository.create({
        ...consumable,
        ...updateConsumableDto,
      }),
    );
  }

  async remove(id: number) {
    const consumable = await this.getById(id);
    return this.manufacturerRepository.remove(consumable);
  }

  async addConsumableToEvent(consumableId: number, eventId: number) {
    const consumable = await this.consumableService.getById(consumableId);
    await this.eventService.addConsumableToEvent(eventId, consumable);
  }

  async removeConsumableFromEvent(consumableId: number, eventId: number) {
    const consumable = await this.consumableService.getById(consumableId);
    await this.eventService.removeConsumableFromEvent(eventId, consumable);
  }
}
