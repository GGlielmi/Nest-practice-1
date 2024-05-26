import { FindOptionsOrder, FindOptionsWhere } from 'typeorm';

export interface IFindParams<Entity> {
  getWhereParams(): FindOptionsWhere<Entity>;
  getOrderParam(): FindOptionsOrder<Entity>;
}
