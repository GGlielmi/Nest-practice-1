import { Injectable } from '@nestjs/common';
import { CreateManufacturerDto } from '../dto/create-manufacturer.dto';
import { UpdateManufacturerDto } from '../dto/update-manufacturer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Manufacturer } from '../entities/Manufacturer.entity';
import { Repository } from 'typeorm';
import { FindManufacturerDto } from '../dto/find-manufacturer.dto';
import { ConsumablesService } from './consumables.service';
import { EventsService } from 'src/events/services/events.service';
import { CurrentUser } from 'src/decorators/getUser.decorator';
import { User } from 'src/user/entities/user.entity';
import { Query, Resolver } from '@nestjs/graphql';

@Injectable()
@Resolver(Manufacturer)
export class ManufacturersService {
  constructor(
    @InjectRepository(Manufacturer)
    private readonly manufacturerRepository: Repository<Manufacturer>,
    private readonly consumableService: ConsumablesService,
    private readonly eventService: EventsService,
  ) {}

  async create(createManufacturerDto: CreateManufacturerDto) {
    const manufacturer = await this.manufacturerRepository.save(
      this.manufacturerRepository.create(createManufacturerDto),
    );
    return manufacturer.userId;
  }

  findAll(query: FindManufacturerDto) {
    return this.manufacturerRepository.find({ where: query });
  }

  async getById(id: number) {
    return this.manufacturerRepository.findOneByOrFail({
      userId: id,
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
    const manufacturer = await this.getById(id);
    return this.manufacturerRepository.remove(manufacturer);
  }

  async addConsumableToEvent(
    consumableId: number,
    eventId: number,
    manufacturerId: number,
  ) {
    const consumable = await this.consumableService.getById(
      consumableId,
      manufacturerId,
    );
    await this.eventService.addConsumableToEvent(
      eventId,
      consumable,
      manufacturerId,
    );
  }

  async removeConsumableFromEvent(
    consumableId: number,
    eventId: number,
    manufacturerId: number,
  ) {
    const consumable = await this.consumableService.getById(
      consumableId,
      manufacturerId,
    );
    await this.eventService.removeConsumableFromEvent({
      eventId,
      consumable,
      manufacturerId,
    });
  }

  @Query(() => Manufacturer)
  me(@CurrentUser() user: User) {
    return this.manufacturerRepository.findOneBy({ userId: user.userId });
  }
}
