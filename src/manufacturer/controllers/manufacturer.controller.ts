import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ManufacturerService } from '../services/manufacturer.service';
import { CreateManufacturerDto } from '../dto/create-manufacturer.dto';
import { UpdateManufacturerDto } from '../dto/update-manufacturer.dto';
import { FindManufacturerDto } from '../dto/find-manufacturer.dto';

@Controller('manufacturer')
export class ManufacturerController {
  constructor(private readonly manufacturerService: ManufacturerService) {}

  @Post()
  create(@Body() createManufacturerDto: CreateManufacturerDto) {
    return this.manufacturerService.create(createManufacturerDto);
  }

  @Get()
  findAll(@Query() query: FindManufacturerDto) {
    return this.manufacturerService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.manufacturerService.getById(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateManufacturerDto: UpdateManufacturerDto,
  ) {
    return this.manufacturerService.update(+id, updateManufacturerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.manufacturerService.remove(+id);
  }

  @Get(':consumableId/:eventId')
  async addConsumableToEvent(
    @Param('consumableId') consumableId: number,
    @Param('eventId') eventId: number,
  ) {
    return this.manufacturerService.addConsumableToEvent(consumableId, eventId);
  }

  @Get(':consumableId/:eventId')
  async removeConsumableFromEvent(consumableId: number, eventId: number) {
    return this.manufacturerService.removeConsumableFromEvent(
      consumableId,
      eventId,
    );
  }
}
