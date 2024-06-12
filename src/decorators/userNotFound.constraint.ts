import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Manufacturer } from 'src/manufacturer/entities/Manufacturer.entity';

@Injectable()
@ValidatorConstraint({ async: true })
// this class could be used in Manufacturer's `username` field
export class UserDoesNotExistConstraint
  implements ValidatorConstraintInterface
{
  constructor(
    @InjectRepository(Manufacturer)
    private readonly manufacturersRepository: Repository<Manufacturer>,
  ) {}

  async validate(
    value: any, // value of the decorated class prop
    { property }: ValidationArguments, // key of the decorated class prop
  ): Promise<boolean> {
    const entity = await this.manufacturersRepository.findOneBy({
      [property]: value,
    });

    return entity === null;
  }

  defaultMessage?(validationArguments?: ValidationArguments): string {
    return `${validationArguments.property} already taken`;
  }
}

export function UserDoesNotExist(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: UserDoesNotExistConstraint,
    });
  };
}
