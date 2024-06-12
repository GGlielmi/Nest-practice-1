import {
  Catch,
  ArgumentsHost,
  NotFoundException,
  ExceptionFilter,
} from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';

@Catch(EntityNotFoundError)
export class EntityNotFoundErrorFilter implements ExceptionFilter {
  catch(context: any, host: ArgumentsHost) {
    return new NotFoundException('Entity not found');
  }
}
