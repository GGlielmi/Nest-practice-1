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
import { ConsumablesService } from '../services/consumables.service';
import { CreateConsumableDto } from '../dto/create-consumable.dto';
import { FindConsumableDto } from '../dto/find-consumable.dto';
import { UpdateConsumableDto } from '../dto/update-consumable.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Events')
@Controller('consumables')
export class ConsumablesController {
  constructor(private readonly consumablesService: ConsumablesService) {}

  @Post()
  @ApiOperation({ summary: 'Creates an event consumable type' })
  create(@Body() createConsumableDto: CreateConsumableDto) {
    return this.consumablesService.create(createConsumableDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get consumables through http query' })
  findAll(@Query() query: FindConsumableDto) {
    return this.consumablesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get consumables by id' })
  findOne(@Param('id') id: string) {
    return this.consumablesService.findById(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update consumable partially' })
  update(
    @Param('id') id: string,
    @Body() updateConsumableDto: UpdateConsumableDto,
  ) {
    return this.consumablesService.update(+id, updateConsumableDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete consumable' })
  remove(@Param('id') id: string) {
    return this.consumablesService.remove(+id);
  }
}
