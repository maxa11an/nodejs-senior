import { Field, InputType, Int } from '@nestjs/graphql';
import { Prisma, Role } from '@prisma/client';

@InputType()
export class WhereCustomerInput {
  @Field(() => String, { nullable: true })
  id?: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

  @Field(() => String, { nullable: true })
  accessToken?: string;

  @Field(() => Date, { nullable: true })
  accessTokenExpire?: Date;

  @Field(() => String, { nullable: true })
  refreshToken?: string;

  @Field(() => Date, { nullable: true })
  refreshTokenExpire?: Date;

  @Field(() => Int, { nullable: true })
  verificationCode?: number;

  @Field(() => Date, { nullable: true })
  verifiedAt?: Date;
}

@InputType()
export class GetCustomerInput {
  @Field(() => String, { nullable: true })
  cursor?: Prisma.CustomerWhereUniqueInput;

  @Field(() => Int, { nullable: true })
  skip: number;

  @Field(() => Int, { nullable: true })
  take: number;

  @Field(() => WhereCustomerInput, { nullable: true })
  where: WhereCustomerInput;
}

@InputType()
export class CreateCustomerInput {
  @Field(() => String, { nullable: false })
  email: string;

  @Field(() => String, { nullable: false })
  password: string;
}

@InputType()
export class UpdateCustomerInput {
  @Field(() => Role, { nullable: true, defaultValue: Role.USER })
  role?: Role;

  @Field(() => String, { nullable: false })
  email?: string;

  @Field(() => String, { nullable: true })
  password?: string;

  @Field(() => String, { nullable: false, defaultValue: new Date() })
  updatedAt?: Date;
}
