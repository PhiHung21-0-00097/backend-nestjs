import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { UserService } from 'src/modules/users/user.service';
import { IUser } from './../../../dist/modules/users/users.interface.d';
import { User } from 'src/auth/decorators/user.decorator';
import { ResponseMessage } from 'src/auth/decorators/response_message.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userServices: UserService) {}
  @Post()
  @ResponseMessage('Create a new user')
  create(@Body() createUserDto: CreateUserDto, @User() user: IUser) {
    return this.userServices.create(createUserDto, user);
  }

  @Get()
  finAll() {
    return this.userServices.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    console.log(id);
    return this.userServices.findOne(id);
  }

  // GET-ID
  // @Get('pipe/:id')
  // getUserByIdPipe(@Param('id', ParseIntPipe) id: number) {
  //   console.log('id: ', id);
  //   return 'id: ' + id;
  // }
  // @Get('param/:id')
  // getUserByIdParam(@Param('id') id: number) {
  //   console.log('id: ', id);
  //   return 'id: ' + id;
  // }
  // @Get('param/:id')
  // getUserByIdValidatiton(@Param('id') id: number) {
  //   console.log('id: ', id);
  //   return 'id: ' + id;
}
