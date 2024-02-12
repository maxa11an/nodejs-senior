import { NotAcceptableException } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import {
  RegisterInput,
  SignInInput,
  VerifyCustomerInput,
} from './dto/auth.input';
import { SignInRes } from './dto/auth.output';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SignInRes)
  async signIn(@Args('data') signInInput: SignInInput) {
    if (signInInput.refreshToken && !signInInput.email) {
      return this.authService.refreshAccessToken(signInInput.refreshToken);
    }
    return this.authService.signIn(signInInput);
  }

  @Mutation(() => Boolean)
  async verify(@Args('data') verifyInput: VerifyCustomerInput) {
    return this.authService.validateVerificationCode(verifyInput);
  }

  @Mutation(() => Boolean)
  async register(@Args('data') registerInput: RegisterInput) {
    if (registerInput.password !== registerInput.passwordConfirm) {
      throw new NotAcceptableException();
    }
    await this.authService.registerCustomer(registerInput);
    return true;
  }
}
