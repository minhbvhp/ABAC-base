import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../auth/guards/local.guard';
import { RequestWithUser } from 'src/utils/types/request.type';
import { CustomResponseType } from 'src/utils/types/definitions';
import { JwtRefreshTokenGuard } from 'src/modules/auth/guards/jwt-refresh-token.guard';
import { TokenPayload } from 'src/modules/auth/interfaces/token.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async signIn(@Req() request: RequestWithUser): Promise<CustomResponseType> {
    const { user } = request;

    const result = await this.authService.signIn(user);

    const res: CustomResponseType = {
      message: 'Đăng nhập thành công',
      result,
    };
    return res;
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh')
  async refreshAccessToken(@Req() request: RequestWithUser) {
    const { user } = request;

    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
    };

    const result = this.authService.generateAccessToken(payload);

    const res: CustomResponseType = {
      message: 'Refresh',
      result,
    };

    return res;
  }
}
