import { genSaltSync, hashSync } from 'bcryptjs';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/modules/users/dto/update-user';
import { BaseService } from 'src/base/base.service';
import { User, UserDocument } from 'src/modules/users/user.entity';
import * as bcrypt from 'bcrypt';
import { formatDate } from 'src/utils';
import { StatusResponse } from 'src/common/enums/StatusResponse.enum';
import { PermissionService } from 'src/modules/permission/permission.service';
@Injectable()
export class UserService extends BaseService<UserDocument> {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    // @InjectModel(Team.name) private teamModel: Model<TeamDocument>,
    private readonly permissionService: PermissionService,
  ) {
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

  async checkEmail(email: string) {
    if (!email) return null;
    const user = await this.userModel.findOne({ email, isDelete: false });
    return user;
  }

  async checkUsername(username: string) {
    const user = await this.userModel.findOne({
      username,
      isDelete: false,
    });
    return user;
  }

  async checkPassword(password: string, hashPassword: string) {
    const isCorrectPassword = await bcrypt.compare(password, hashPassword);
    return isCorrectPassword;
  }

  async findByUsername(username: string) {
    const user = await this.userModel.findOne({
      username,
      isDelete: false,
    });
    return user;
  }

  async findOneByEmail(email: string) {
    return this.userModel.findOne({ email }).populate({
      path: 'role',
      select: {
        name: 1,
      },
    });
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userModel.findById(new Types.ObjectId(id));
  }

  async create(
    createUserDto: CreateUserDto,
    request: Request,
    userIp: string,
    _user?: UserDocument,
  ) {
    try {
      const { password } = createUserDto;
      const hashPassword = await bcrypt.hash(password, 10);

      const alreadyUsername = await this.checkUsername(createUserDto?.username);
      const teams = [];
      let logTeam = `(Trống)`;
      if (createUserDto.hasOwnProperty('teams')) {
        let arrTeamName = [];
        for (const team of createUserDto.teams) {
          // const checkTeam = await this.teamModel.findById(
          //   new Types.ObjectId(team),
          // );
          // if (!checkTeam) continue;
          // arrTeamName.push(`${checkTeam.name}`);
          teams.push(new Types.ObjectId(team));
        }
        if (!!arrTeamName.length) logTeam = arrTeamName.join(', ');
      }
      if (alreadyUsername) {
        throw new HttpException(
          {
            status: StatusResponse.EXISTS_USERNAME,
            message: 'Already Exist Username!',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const alreadyEmail = await this.checkEmail(createUserDto?.email);

      if (alreadyEmail) {
        throw new HttpException(
          {
            status: StatusResponse.EXISTS_EMAIL,
            message: 'Already Exist Email!',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const newUser = await this.userModel.create({
        ...createUserDto,
        password: hashPassword,
        teams,
        role: new Types.ObjectId(createUserDto?.role),
      });

      const user = await this.userModel.findById(newUser?._id).populate([
        { path: 'role', select: 'name' },
        { path: 'teams', select: '_id name' },
      ]);
      let stringLog = `${_user?.username || 'Khách vãng lai'} vừa tạo mới 1 người dùng có các thông tin :\nTên đăng nhập: ${user.username}\nTên: ${user.username}\nEmail: ${user?.email || 'Trống'}\nVai trò: ${user?.role?.username || 'Trống'}\nTeam: ${logTeam}.\nVào lúc: <b>${formatDate(
        new Date(),
      )}</b>\nIP người thực hiện: ${userIp}.`;
      console.log('logTeam: ', logTeam);
      request['new-data'] =
        `Tên đăng nhập: ${user.username}\nTên: ${user.username}\nEmail: ${user?.email || 'Trống'}\nVai trò: ${user?.role?.username || 'Trống'}\nTeam: ${logTeam}`;
      request['message-log'] = stringLog;
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

  async updateUserById(
    id: string,
    updateUser: UpdateUserDto,
    request: Request,
    userIp: string,
    _user: UserDocument,
  ) {}

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
