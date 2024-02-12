import { Request } from 'express';
import { CustomerService } from 'src/customer/customer.service';

import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class PrivateGuard implements CanActivate {
  constructor(private readonly customerService: CustomerService) {}
  async canActivate(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context);
    const gqlReq = gqlContext.getContext().req;
    const token = this.fetchToken(gqlReq);
    if (!token) throw new UnauthorizedException();
    try {
      const customer = await this.customerService.findOneByAccessToken(token);
      gqlReq['customer'] = customer;
    } catch (error) {
      throw new ForbiddenException();
    }
    return true;
  }

  private fetchToken(req: Request): string | undefined {
    return req.headers.authorization?.split(' ')[1];
  }
}
