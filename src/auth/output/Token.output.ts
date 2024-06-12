import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TokenOutput {
  @Field()
  private token: string;
  constructor(token: string) {
    this.token = token;
  }
}
