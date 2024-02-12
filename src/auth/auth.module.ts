import { CustomerModule } from 'src/customer/customer.module';

import { Module } from '@nestjs/common';

import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [CustomerModule],
  controllers: [],
  providers: [AuthService, AuthResolver],
})
export class AuthModule {}
