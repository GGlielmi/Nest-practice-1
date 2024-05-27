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
import { ManufacturersService } from '../services/manufacturer.service';
import { CreateManufacturerDto } from '../dto/create-manufacturer.dto';
import { UpdateManufacturerDto } from '../dto/update-manufacturer.dto';
import { FindManufacturerDto } from '../dto/find-manufacturer.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateConsumableDto } from '../dto/create-consumable.dto';
import { FindConsumableDto } from '../dto/find-consumable.dto';
import { UpdateConsumableDto } from '../dto/update-consumable.dto';
import { ConsumablesService } from '../services/consumables.service';

@ApiTags('Manufacturers')
@Controller('manufacturer')
export class ManufacturerController {
  constructor(
    private readonly manufacturerService: ManufacturersService,
    private readonly consumableService: ConsumablesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Creates a manufacturer' })
  create(@Body() createManufacturerDto: CreateManufacturerDto) {
    return this.manufacturerService.create(createManufacturerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get manufacturers through http query' })
  findAll(@Query() query: FindManufacturerDto) {
    return this.manufacturerService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get manufacturers by id' })
  findOne(@Param('id') id: string) {
    return this.manufacturerService.getById(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update manufacturer partially' })
  update(
    @Param('id') id: string,
    @Body() updateManufacturerDto: UpdateManufacturerDto,
  ) {
    return this.manufacturerService.update(+id, updateManufacturerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete manufacturer' })
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

  @Post('consumables')
  @ApiOperation({ summary: 'Creates a consumabl' })
  createConsumable(@Body() createConsumableDto: CreateConsumableDto) {
    return this.consumableService.create(createConsumableDto);
  }

  @Get('consumables')
  @ApiOperation({ summary: 'Get consumables through http query' })
  findAllConsumable(@Query() query: FindConsumableDto) {
    return this.consumableService.findAll(query);
  }

  @Get('/consumables/:id')
  @ApiOperation({ summary: 'Get consumables by id' })
  findOneConsumable(@Param('id') id: string) {
    return this.consumableService.getById(+id);
  }

  @Patch('/consumables/:id')
  @ApiOperation({ summary: 'Update consumable partially' })
  updateConsumable(
    @Param('id') id: string,
    @Body() updateConsumableDto: UpdateConsumableDto,
  ) {
    return this.consumableService.update(+id, updateConsumableDto);
  }

  @Delete('/consumables/:id')
  @ApiOperation({ summary: 'Delete consumable' })
  removeConsumable(@Param('id') id: string) {
    return this.consumableService.remove(+id);
  }
}
