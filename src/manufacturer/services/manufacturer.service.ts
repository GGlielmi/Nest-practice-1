import { Injectable } from '@nestjs/common';
import { CreateManufacturerDto } from '../dto/create-manufacturer.dto';
import { UpdateManufacturerDto } from '../dto/update-manufacturer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Manufacturer } from '../entities/Manufacturer.entity';
import { Repository } from 'typeorm';
import { FindManufacturerDto } from '../dto/find-manufacturer.dto';
import { ConsumablesService } from './consumables.service';
import { EventsService } from 'src/events/services/events.service';

@Injectable()
export class ManufacturersService {
  constructor(
    @InjectRepository(Manufacturer)
    private readonly manufacturerRepository: Repository<Manufacturer>,
    private readonly consumableService: ConsumablesService,
    private readonly eventService: EventsService,
  ) {}

  create(createManufacturerDto: CreateManufacturerDto) {
    return this.manufacturerRepository.save(createManufacturerDto);
  }

  findAll(query: FindManufacturerDto) {
    return this.manufacturerRepository.find({ where: query });
  }

  async getById(id: number) {
    return this.manufacturerRepository.findOneByOrFail({
      manufacturerId: id,
    });
  }

  async update(id: number, updateManufacturerDto: UpdateManufacturerDto) {
    const manufacturer = await this.getById(id);
    return this.manufacturerRepository.save(
      this.manufacturerRepository.create({
        ...manufacturer,
        ...updateManufacturerDto,
      }),
    );
  }

  async remove(id: number) {
    const consumable = await this.getById(id);
    return this.manufacturerRepository.remove(consumable);
  }

  addConsumable(consumableId: number, manufacturerId: number) {
    return this.manufacturerRepository
      .createQueryBuilder()
      .relation(Manufacturer, 'consumables')
      .of(manufacturerId)
      .add(consumableId);
  }

  removeConsumable(consumableId: number, manufacturerId: number) {
    return this.manufacturerRepository
      .createQueryBuilder()
      .relation(Manufacturer, 'consumables')
      .of(manufacturerId)
      .add(consumableId);
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
