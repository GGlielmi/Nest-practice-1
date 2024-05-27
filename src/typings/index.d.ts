import { orderDirection } from 'src/constants/db';

declare global {
  type TOrderDirection = (typeof orderDirection)[number];

  interface IPaginationResult<T = any> {
    lastPage: number;
    totalCount: number;
    pageNumber: number;
    data: T[];
  }
}
