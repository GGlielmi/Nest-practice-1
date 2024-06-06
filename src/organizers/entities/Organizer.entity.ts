import { Event } from 'src/events/entities/Event.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, OneToMany } from 'typeorm';

@Entity()
export class Organizer extends User {
  @OneToMany(() => Event, (event) => event.organizer, {
    onDelete: 'CASCADE',
  })
  events: Event[];
}
