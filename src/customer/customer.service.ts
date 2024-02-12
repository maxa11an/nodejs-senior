import { PrismaService } from 'src/prisma.service';

import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import {
  GetCustomerInput,
  UpdateCustomerInput,
  WhereCustomerInput,
} from './dto/customer.input';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}
  async findAll(params: GetCustomerInput) {
    const { skip, take, cursor, where } = params;

    return this.prisma.customer.findMany({
      skip,
      take,
      cursor,
      where,
    });
  }

  async createOne(email: string, password: string) {
    try {
      await this.prisma.customer.create({
        data: {
          email,
          password,
          verificationCode: Math.floor(1000 + Math.random() * 9000),
        },
      });
    } catch (exception) {
      if (exception instanceof Prisma.PrismaClientKnownRequestError) {
        if (exception.code === 'P2002') {
          throw new ConflictException();
        } else {
          throw new InternalServerErrorException();
        }
      }
    }
  }

  async findUnique(params: WhereCustomerInput) {
    return this.prisma.customer.findUniqueOrThrow({
      where: params,
    });
  }

  async findOneByAccessToken(accessToken: string) {
    return this.prisma.customer.findFirstOrThrow({
      where: {
        accessToken,
        accessTokenExpire: {
          gt: new Date(),
        },
      },
    });
  }

  async findOneByRefreshToken(refreshToken: string) {
    return this.prisma.customer.findFirstOrThrow({
      where: {
        refreshToken,
        refreshTokenExpire: {
          gt: new Date(),
        },
      },
    });
  }

  async deleteOne(emailOrId: string) {
    let identifier: Prisma.CustomerWhereUniqueInput = {
      id: emailOrId,
    };
    if (emailOrId.includes('@')) {
      identifier = {
        email: emailOrId,
      };
    }
    try {
      await this.prisma.customer.delete({ where: identifier });
    } catch (exception) {
      if (exception instanceof Prisma.PrismaClientKnownRequestError) {
        if (exception.code === 'P2025') {
          throw new NotFoundException();
        }
        throw new InternalServerErrorException();
      }
    }
    return true;
  }

  async updateOne(emailOrId: string, customerData: UpdateCustomerInput) {
    let identifier: Prisma.CustomerWhereUniqueInput = {
      id: emailOrId,
    };
    if (emailOrId.includes('@')) {
      identifier = {
        email: emailOrId,
      };
    }
    try {
      const customer = await this.prisma.customer.update({
        data: customerData,
        where: identifier,
      });
      return customer;
    } catch (exception) {
      if (exception instanceof Prisma.PrismaClientKnownRequestError) {
        if (exception.code === 'P2025') {
          throw new NotFoundException();
        }
        throw new InternalServerErrorException();
      }
    }
  }

  async verifyById(id: string) {
    return this.prisma.customer.update({
      data: {
        verifiedAt: new Date(),
        verificationCode: null,
      },
      where: {
        id: id,
      },
    });
  }
}
