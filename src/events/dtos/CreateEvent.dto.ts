import { Length } from 'class-validator';

export class CreateEventDto {
  @Length(1)
  name: string = undefined;
  @Length(1, 100)
  description: string = undefined;
  @Length(1)
  when: Date = undefined;
  @Length(1)
  address: string = undefined;
}
