import { PartialType } from '@nestjs/swagger';
import {
  InputType,
  ObjectType,
  OmitType,
  PartialType as PartialTypeGql,
  PickType,
} from '@nestjs/graphql';
import { BaseEventDto } from './BaseEvent.dto';
import { GetEventDto } from './GetEvent.dto';

export class UpdateEventDto extends PartialType(BaseEventDto) {}

@InputType('updateEventGqlDto')
export class UpdateEventGqlDto extends PartialTypeGql(
  OmitType(BaseEventDto, ['cost']),
) {}

@ObjectType()
export class DeleteEventGqlDto extends PickType(GetEventDto, ['eventId']) {}
