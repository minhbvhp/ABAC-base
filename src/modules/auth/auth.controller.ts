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
import { LocalAuthGuard } from 'src/modules/auth/guards/local.guard';
import { RequestWithUser } from 'src/utils/types/request.type';
import { CustomResponseType } from 'src/utils/types/definitions';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async signIn(@Req() request: RequestWithUser): Promise<CustomResponseType> {
    const { user } = request;

    const result = await this.authService.signIn(user.id);

    const res: CustomResponseType = {
      message: 'Đăng nhập thành công',
      result,
    };
    return res;
  }
}
