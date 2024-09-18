import { Controller, Post, Body, Req, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Logging } from 'src/decorators/logging.decorator';
import { GetClientIP } from 'src/decorators/client-ip.decorator';

import { ActionLogEnum } from 'src/common/enums/ActionLog.enum';
import { SubjectEnum } from 'src/common/enums/SubjectRoles.enum';
import { LoginUserDto } from 'src/modules/users/dto/login-user.dto';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { Request } from 'express';
@Controller('auths')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Logging('Đăng ký tài khoản mới', ActionLogEnum.REGISTER, SubjectEnum.USER)
  @Post('sign-up')
  signUp(
    @Body() createUserDto: CreateUserDto,
    @Req() request: Request,
    @GetClientIP() userIp: string,
  ) {
    return this.authService.signUp(createUserDto, request, userIp);
  }
  @Logging('Đăng nhập', ActionLogEnum.LOGIN, SubjectEnum.USER)
  @HttpCode(200)
  @Post('/sign-in')
  signIn(
    @Body() user: LoginUserDto,
    @Req() request: Request,
    @GetClientIP() userIp: string,
  ) {
    return this.authService.signIn(user, request, userIp);
  }
}
