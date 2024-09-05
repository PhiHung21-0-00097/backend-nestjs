import { Controller, Post } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authServices: AuthService) {}

  // POST
  // @Post('/sign-up')
  // signUp(@Body() users: CreateUserDto) {
  //   return this.authServices.signUp(users);
  // }

  @Post('/sign-in')
  signIn() {
    return this.authServices.signIn();
  }
}
