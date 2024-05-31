import { CreateConsumableDto } from 'src/manufacturer/dto/create-consumable.dto';
import { ConsumableType } from 'src/manufacturer/entities/Consumable.entity';

export const createConsumableDtoStub: CreateConsumableDto = {
  manufacturerId: 1,
  brand: 'asd',
  type: ConsumableType.DRINK,
  cost: 5,
};
