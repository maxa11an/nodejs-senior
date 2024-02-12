import { randomUUID } from 'crypto';
import { CustomerService } from 'src/customer/customer.service';

import {
  Injectable,
  NotFoundException,
  PreconditionFailedException,
  UnauthorizedException,
} from '@nestjs/common';

import {
  RegisterInput,
  SignInInput,
  VerifyCustomerInput,
} from './dto/auth.input';

@Injectable()
export class AuthService {
  constructor(private readonly customerService: CustomerService) {}

  async refreshAccessToken(refreshToken: string) {
    try {
      const customer = await this.customerService.findOneByRefreshToken(
        refreshToken,
      );
      const now = new Date().getTime();
      customer.accessToken = randomUUID().replace(/-/g, '');
      customer.accessTokenExpire = new Date(now + 60 * 60 * 24 * 1000);
      await this.customerService.updateOne(customer.id, customer);

      return {
        accessToken: customer.accessToken,
        accessTokenExpire: customer.accessTokenExpire,
      };
    } catch {
      throw new UnauthorizedException();
    }
  }

  async signIn(params: SignInInput) {
    const { email, password } = params;
    const customer = await this.customerService.findUnique({ email: email });

    if (customer.password !== password) {
      throw new UnauthorizedException();
    }

    if (customer.verifiedAt === null && customer.verificationCode !== null) {
      throw new PreconditionFailedException();
    }
    // Task does not state any security measures to be taken, therefor own implementation. Preferably some solution like JWT...
    const now = new Date().getTime();
    customer.accessToken = randomUUID().replace(/-/g, '');
    customer.accessTokenExpire = new Date(now + 60 * 60 * 24 * 1000);

    customer.refreshToken = randomUUID().replace(/-/g, '');
    customer.refreshTokenExpire = new Date(now + 60 * 60 * 24 * 1000 * 30);

    await this.customerService.updateOne(customer.id, customer);

    return {
      accessToken: customer.accessToken,
      accessTokenExpire: customer.accessTokenExpire,
      refreshToken: customer.refreshToken,
      refreshTokenExpire: customer.refreshTokenExpire,
    };
  }

  async registerCustomer(params: RegisterInput) {
    const { email, password } = params;
    return this.customerService.createOne(email, password);
  }

  async validateVerificationCode(params: VerifyCustomerInput) {
    const { email, password, verificationCode } = params;
    const customer = await this.customerService.findUnique({ email: email });

    if (
      customer.verifiedAt === null &&
      customer.verificationCode === verificationCode &&
      customer.password === password
    ) {
      await this.customerService.verifyById(customer.id);
      return true;
    }
    throw new NotFoundException();
  }
}
