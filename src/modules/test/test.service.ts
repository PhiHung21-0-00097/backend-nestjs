import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseService } from 'src/base/base.service';
import { StatusResponse } from 'src/common/enums/StatusResponse.enum';
import { Test, TestDocument } from 'src/modules/test/test.entity';
@Injectable()
export class TestService extends BaseService<TestDocument> {
  constructor(@InjectModel(Test.name) private testModel: Model<TestDocument>) {
    super(testModel);
  }
}
