import { PrismaService } from 'src/prisma.service';

import { Module } from '@nestjs/common';

import { CustomerResolver } from './customer.resolver';
import { CustomerService } from './customer.service';

@Module({
  imports: [],
  providers: [CustomerService, PrismaService, CustomerResolver],
  exports: [CustomerService],
})
export class CustomerModule {}
