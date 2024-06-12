import { BeforeInsert, Column, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field()
  role: string;

  @PrimaryGeneratedColumn()
  @Field()
  userId: number;

  @Column()
  @Field()
  username: string;

  @Column({ select: false })
  @Field()
  password: string;

  @Column()
  @Field()
  email: string;

  @Column()
  @Field()
  firstName: string;

  @Column()
  @Field()
  lastName: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, +process.env.JWT_SALT);
  }
}
