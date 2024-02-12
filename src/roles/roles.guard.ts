import { Customer } from 'src/lib/entities/customer.entity';

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

import type { Role as PrismaRole } from '@prisma/client';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<PrismaRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) {
      return true;
    }
    const gqlContext = GqlExecutionContext.create(context);
    const gqlReq = gqlContext.getContext().req;
    const { customer }: { customer: Customer } = gqlReq;
    return roles.some((role) => customer?.role == role);
  }
}
