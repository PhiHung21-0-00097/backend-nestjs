import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseService } from 'src/base/base.service';
import { StatusResponse } from 'src/common/enums/StatusResponse.enum';
import { CreateUserDtoCopy } from 'src/modules/users/dto/create-user.dto-copy';
import { Test, TestDocument } from 'src/modules/test/test.entity';
@Injectable()
export class TestService extends BaseService<TestDocument> {
  constructor(@InjectModel(Test.name) private testModel: Model<TestDocument>) {
    super(testModel);
  }

  async loginCreateUser(createUserDto: CreateUserDtoCopy) {
    try {
      const newUser = await this.testModel.create({
        ...createUserDto,
      });
      const user = await this.testModel.findById(newUser?._id);

      return {
        status: StatusResponse.SUCCESS,
        message: 'Create New User successfully',
        user,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        {
          status: HttpStatus.BAD_GATEWAY,
          error,
        },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
