import { BadRequestException, Injectable } from '@nestjs/common';
import User from '../users/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';

import {
  EMAIL_OR_PASSWORD_WRONG,
  SERVICE_ERROR_DESCRIPTION,
} from '../../utils/constants/messageConstants';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from 'src/modules/auth/interfaces/token.interface';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async getAuthenticatedUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.usersService.getUserbyEmail(email);
      await this.verifyPlainContentWithHashedContent(password, user.password);
      return user;
    } catch (error) {
      throw new BadRequestException(
        EMAIL_OR_PASSWORD_WRONG,
        `${SERVICE_ERROR_DESCRIPTION} - get authenticated user`,
      );
    }
  }

  private async verifyPlainContentWithHashedContent(
    plain_text: string,
    hashed_text: string,
  ) {
    const is_matching = await bcrypt.compare(plain_text, hashed_text);
    if (!is_matching) {
      throw new BadRequestException(
        EMAIL_OR_PASSWORD_WRONG,
        `${SERVICE_ERROR_DESCRIPTION} - verify plain content with hashed content`,
      );
    }
  }

  generateAccessToken(payload: TokenPayload) {
    return this.jwtService.sign(payload, {
      secret: 'access_token_secret',
      expiresIn: `${this.configService.get<string>(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
  }

  generateRefreshToken(payload: TokenPayload) {
    return this.jwtService.sign(payload, {
      secret: 'refresh_token_secret',
      expiresIn: `${this.configService.get<string>(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
  }
  async signIn(userId: string) {
    try {
      const access_token = this.generateAccessToken({
        userId,
      });
      const refresh_token = this.generateRefreshToken({
        userId,
      });
      // await this.storeRefreshToken(userId, refresh_token);
      return {
        access_token,
        refresh_token,
      };
    } catch (error) {
      throw error;
    }
  }
}
