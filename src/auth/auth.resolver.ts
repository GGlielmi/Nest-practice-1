import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { TokenOutput } from './output/Token.output';
import { LoginInput } from './input/Login.input';

@Resolver(TokenOutput)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => TokenOutput)
  async login(
    @Args('credentials', { type: () => LoginInput }) login: LoginInput,
    @Context() context,
  ) {
    return new TokenOutput(
      this.authService.getToken(
        await this.authService.validate(context.req, login.user, login.pass),
      ),
    );
  }
}
