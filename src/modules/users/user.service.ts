import { genSaltSync, hashSync } from 'bcryptjs';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserDocument, Users } from 'src/modules/users/schemas/user.schema';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { IUser } from 'src/modules/users/users.interface';
import { UpdateUserDto } from 'src/modules/users/dto/update-user';
import { BaseService } from 'src/base/base.service';
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
    return this.userModel.findOne({ email }).populate({
      path: 'role',
      select: {
        name: 1,
      },
    });
  }

  async findAll(): Promise<Users[]> {
    return this.userModel.find().exec();
  }

  async getUserById(id: string): Promise<Users | null> {
    return this.userModel.findById(new Types.ObjectId(id));
  }

  async create(crearteUserDto: CreateUserDto) {
    const createdUser = new this.userModel(crearteUserDto);
    return createdUser.save();
  }

  async update(id: string, updateUserDto: UpdateUserDto, user: IUser) {
    console.log('updateUserDto: ', updateUserDto);
    return this.updateData({
      id,
      updateDto: {
        ...updateUserDto,
        updatedBy: user?._id,
      },
    });
  }

  async remove(id: string) {
    const foundUser = await this.userModel.findById(id);

    if (foundUser?.email === 'admin@gmail.com') {
      throw new BadRequestException('Not allowed to remove admin user');
    }
    await this.userModel.deleteOne({
      _id: id,
    });
    console.log('Xoá thành công');
    return foundUser;
  }
}
