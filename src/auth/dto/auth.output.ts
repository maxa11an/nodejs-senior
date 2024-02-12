import { Optional } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RefreshRes {
  @Field(() => String)
  accessToken: string;

  @Field(() => Date)
  accessTokenExpire: Date;
}

@ObjectType()
export class SignInRes extends RefreshRes {
  @Optional()
  @Field(() => String)
  refreshToken: string;

  @Optional()
  @Field(() => Date)
  refreshTokenExpire: Date;
}
