import { BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid') // with autoincrement
  id: number;

  @Column()
  name: string;

  @Column({ length: 100 })
  description: string;

  @Column()
  when: Date;

  @Column()
  address: string;

  @BeforeUpdate()
  formatWhenField() {
    return new Date(this.when);
  }
}
