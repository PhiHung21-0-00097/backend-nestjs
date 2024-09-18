import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDtoCopy } from 'src/modules/users/dto/create-user.dto-copy';
import { TestService } from 'src/modules/test/test.service';

@Controller('tests')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post('/login')
  loginCreateUser(@Body() createUser: CreateUserDtoCopy) {
    return this.testService.loginCreateUser(createUser);
  }
}
