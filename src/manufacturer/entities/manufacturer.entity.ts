import {
  manufacturerEmailIndex,
  manufacturerUsernameIndex,
} from 'src/constants/uniqueIndexes';
import { Consumable } from 'src/manufacturer/entities/Consumable.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, Index, OneToMany } from 'typeorm';

@Entity()
export class Manufacturer extends User {
  static role = 'Manufacturer' as const;
  role = Manufacturer.role;

  @Index(manufacturerUsernameIndex.constraint, { unique: true })
  username: string;

  @Index(manufacturerEmailIndex.constraint, { unique: true })
  email: string;

  @Column()
  brand: string;

  @OneToMany(() => Consumable, (consumable) => consumable.manufacturer, {
    onDelete: 'CASCADE',
  })
  consumables: Consumable[];
}
