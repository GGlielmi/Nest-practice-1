import { FindOptionsWhere } from 'typeorm';

export interface IWhereParams<Entity> {
  getWhereParams(): FindOptionsWhere<Entity>;
}
