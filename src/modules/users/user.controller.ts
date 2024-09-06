import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { UserService } from 'src/modules/users/user.service';
import { ResponseMessage } from 'src/auth/decorators/response_message.decorator';
import { UpdateUserDto } from 'src/modules/users/dto/update-user';
import { IUser } from 'src/modules/users/users.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userServices: UserService) {}

  @Post()
  @ResponseMessage('Create a new user')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userServices.create(createUserDto);
  }

  @Get()
  finAll() {
    return this.userServices.findAll();
  }

  @Get(':id')
  @ResponseMessage('Fetch a user by id')
  getUserById(@Param('id') id: string) {
    console.log(id);
    return this.userServices.getUserById(id);
  }

  @Put(':id')
  @ResponseMessage('Update a user by id')
  update(
    @Param('id') id: string,
    @Body() updateUser: UpdateUserDto,
    user: IUser,
  ) {
    return this.userServices.update(id, updateUser, user);
  }
  @Delete(':id')
  @ResponseMessage('Delete a user by id')
  remove(@Param('id') id: string) {
    return this.userServices.remove(id);
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
