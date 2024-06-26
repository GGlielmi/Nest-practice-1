import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  @Field()
  user: string;
  @Field()
  pass: string;
}
