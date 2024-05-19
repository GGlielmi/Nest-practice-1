import { orderDirection } from 'src/constants/db';

declare global {
  type TOrderDirection = (typeof orderDirection)[number];
}
