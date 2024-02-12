import { Customer } from 'lib/entities/customer.entity';
import { PrivateGuard } from 'src/private/private.guard';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';

import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CustomerService } from './customer.service';
import {
  GetCustomerInput,
  UpdateCustomerInput,
  WhereCustomerInput,
} from './dto/customer.input';

@Resolver(() => Customer)
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {}

  @Query(() => [Customer])
  @UseGuards(PrivateGuard)
  async customers(@Args('data') { skip, take, where }: GetCustomerInput) {
    return this.customerService.findAll({ skip, take, where });
  }

  @Query(() => Customer)
  @UseGuards(PrivateGuard)
  async customer(@Args('data') params: WhereCustomerInput) {
    return this.customerService.findUnique(params);
  }

  @Mutation(() => Boolean)
  @UseGuards(PrivateGuard, RolesGuard)
  @Roles('ADMIN')
  async customerDelete(@Args('emailOrId') emailOrId: string) {
    return this.customerService.deleteOne(emailOrId);
  }

  @Mutation(() => Customer)
  @UseGuards(PrivateGuard, RolesGuard)
  @Roles('ADMIN')
  async customerUpdate(
    @Args('emailOrId') emailOrId: string,
    @Args('data') customerUpdateData: UpdateCustomerInput,
  ) {
    return this.customerService.updateOne(emailOrId, customerUpdateData);
  }
}
