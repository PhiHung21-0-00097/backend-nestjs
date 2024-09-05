import { genSaltSync, hashSync } from 'bcryptjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserDocument, Users } from 'src/modules/users/schemas/user.schema';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { IUser } from 'dist/modules/users/users.interface';
import * as bcrypt from 'bcrypt';
import { BaseService } from 'src/base/base.service';
import { toObjectId } from 'src/utils';
@Injectable()
export class UserService extends BaseService<UserDocument> {
  constructor(@InjectModel(Users.name) private userModel: Model<UserDocument>) {
    super(userModel);
  }

  getUserData() {
    throw new Error('Method not implemented.');
  }

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  isValidPassword(password: string, hash: string) {
    return hashSync(password, hash);
  }

  async findOneByEmail(email: string) {
    return await this.userModel.findOne({ email }).populate({
      path: 'role',
      select: {
        name: 1,
      },
    });
  }

  async findAll(): Promise<Users[]> {
    return await this.userModel.find().exec();
  }

  async findOne(id: string): Promise<Users | null> {
    return await this.userModel.findById(new Types.ObjectId(id));
  }

  async create(crearteUserDto: CreateUserDto, user: IUser) {
    const { email, name, password, role } = crearteUserDto;
    const existingUser = await this.findOneByEmail(email);
    if (existingUser) {
      throw new BadRequestException('email already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.createData(
      {
        name,
        email,
        role: toObjectId(role),
        password: hashedPassword,
      },
      [
        {
          path: 'role',
        },
      ],
    );
  }
}
