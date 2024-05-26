import { FindOptionsOrder, FindOptionsWhere } from 'typeorm';

export interface IFindParams<Entity> {
  limit: number;
  offset: number;
  getWhereParams(): FindOptionsWhere<Entity>;
  getOrderParam(): FindOptionsOrder<Entity>;
}
