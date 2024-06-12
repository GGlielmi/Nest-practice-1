import { ObjectType } from '@nestjs/graphql';
import { Event } from 'src/events/entities/Event.entity';
import { Paginated } from 'src/mixins/Paginated.mixin';

@ObjectType()
export class EventFindAllResponse extends Paginated(Event) {}
