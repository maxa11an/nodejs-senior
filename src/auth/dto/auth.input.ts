import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class SignInInput {
  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  password?: string;

  @Field(() => String, { nullable: true })
  refreshToken?: string;
}

@InputType()
export class RegisterInput {
  @Field(() => String, { nullable: false })
  email: string;

  @Field(() => String, { nullable: false })
  password: string;

  @Field(() => String, { nullable: false })
  passwordConfirm: string;
}

@InputType()
export class VerifyCustomerInput {
  @Field(() => String, { nullable: false })
  email: string;

  @Field(() => Int, { nullable: false })
  verificationCode: number;

  @Field(() => String, { nullable: false })
  password: string;
}
