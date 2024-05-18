import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateEventDto } from './dtos/CreateEvent.dto';

@Controller('events')
export class EventsController {
  @Get()
  findAll() {}

  @Get(':id')
  findOne(@Param('id') id: number) {}

  @Post()
  create(@Body() input: CreateEventDto) {}

  @Patch(':id')
  update(@Param('id') id: number) {}

  @Delete(':id')
  delete(@Param('id') id: number) {}
}
