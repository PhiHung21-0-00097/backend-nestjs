import { genSaltSync, hashSync } from 'bcryptjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
import { UpdatePasswordDto } from 'src/modules/users/dto/update-passowrd.dto';
import { Request } from 'express';
import { GetPagination } from 'src/interfaces/get-paging.interface';
import { Team, TeamDocument } from 'src/team/team.entity';
import { adminRole } from 'src/constants';
@Injectable()
export class UserService extends BaseService<UserDocument> {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Team.name) private teamModel: Model<TeamDocument>,
    private readonly permissionService: PermissionService,
  ) {
    super(userModel);
  }

  getUserData() {
    throw new Error('Method not implemented.');
  }

  async findOneById(id: string) {
    try {
      const user = await this.userModel.findById(new Types.ObjectId(id));
      return user;
    } catch (error) {
      return false;
    }
  }

  async checkTeamAndAddTeam(teamId: Types.ObjectId, userId: Types.ObjectId) {
    try {
      await this.userModel
        .updateOne(
          { _id: userId },
          {
            $addToSet: {
              teams: teamId,
            },
          },
        )
        .exec();
      return null;
    } catch (error) {
      return null;
    }
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

  async getAllUser() {
    const users = await this.userModel.find({ isDelete: false }).populate([
      { path: 'role', select: 'name' },
      { path: 'team', select: 'name' },
    ]);

    return {
      status: StatusResponse.SUCCESS,
      message: 'Get All User Success',
      data: users,
    };
  }

  async getUserById(id: string) {
    try {
      const role = await this.userModel.findById(new Types.ObjectId(id));
      if (!role)
        throw new HttpException(
          {
            status: StatusResponse.FAIL,
            message: 'Role By Id Is Not Exists',
          },
          HttpStatus.BAD_GATEWAY,
        );
      return {
        status: StatusResponse.SUCCESS,
        message: 'Get Role By ID Success',
        data: role,
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new HttpException(
        {
          status: StatusResponse.FAIL,
          err,
        },
        HttpStatus.BAD_GATEWAY,
      );
    }
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
        team: new Types.ObjectId(createUserDto?.team),
        role: new Types.ObjectId(createUserDto?.role),
      });
      const user = await this.userModel.findById(newUser?._id).populate([
        { path: 'role', select: 'name' },
        { path: 'team', select: 'name' },
      ]);

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
  ) {
    try {
      const user = await this.userModel.findById(new Types.ObjectId(id));
      if (!user)
        throw new HttpException(
          {
            status: StatusResponse.NOTFOUND,
            message: 'User Id Is Not Found!',
          },
          HttpStatus.BAD_GATEWAY,
        );

      const alreadyUsername = await this.checkUsername(updateUser?.username);
      if (updateUser?.username === user?.username) {
        throw new HttpException(
          {
            status: StatusResponse.EXISTS_USERNAME,
            message: 'Already Exist Username!',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const alreadyEmail = await this.checkEmail(updateUser?.email);

      if (updateUser?.email === user?.email) {
        throw new HttpException(
          {
            status: StatusResponse.EXISTS_EMAIL,
            message: 'Already Exist Email!',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const newData = await this.userModel.findByIdAndUpdate(
        user?._id,
        {
          ...updateUser,
        },
        {
          new: true,
        },
      );
      return {
        status: StatusResponse.SUCCESS,
        message: 'Update User Success',
        data: newData,
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new HttpException(
        {
          status: StatusResponse.FAIL,
          err,
        },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async deleteChangeDelete(id: string) {
    try {
      const user = await this.userModel.findById(new Types.ObjectId(id));
      if (!user)
        throw new HttpException(
          {
            status: StatusResponse.NOTFOUND,
            message: 'User Id Is Not Found!',
          },
          HttpStatus.BAD_REQUEST,
        );
      console.log('user: ', user);
      await this.userModel.findByIdAndUpdate(
        user?._id,
        {
          isDelete: true,
        },
        { new: true },
      );
      return {
        status: StatusResponse.SUCCESS,
        message: 'Delete User Success',
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new HttpException(
        {
          status: StatusResponse.FAIL,
          err,
        },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async deleteById(id: string) {
    try {
      const user = await this.userModel.findById(new Types.ObjectId(id));
      if (!user)
        throw new HttpException(
          {
            status: StatusResponse.NOTFOUND,
            message: 'User Id Is Not Found!',
          },
          HttpStatus.BAD_REQUEST,
        );
      await this.userModel.findByIdAndDelete(new Types.ObjectId(id));
      return {
        status: StatusResponse.SUCCESS,
        message: 'Delete User Success',
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new HttpException(
        {
          status: StatusResponse.FAIL,
          err,
        },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async updatePassword(
    id: string,
    updatePassword: UpdatePasswordDto,
    user: UserDocument,
  ) {
    try {
      const user = await this.userModel.findById(new Types.ObjectId(id));

      const { currentPassword, password } = updatePassword;

      console.log('Password cũ xác thực: ', currentPassword);

      console.log('Password mới: ', password);

      const hashPassword = await bcrypt.hash(password, 10);

      console.log('Password mã hoá: ', hashPassword);

      console.log('Pass cũ ở dạng mã hoá: ', user?.password);

      const checkPassword = await this.checkPassword(
        currentPassword,
        user?.password,
      );
      // check password ở database
      if (!checkPassword) {
        throw new HttpException(
          {
            status: StatusResponse.USERNAME_OR_PASSWORD_IS_NOT_CORRECT,
            message: 'Current Password Is Not Correct',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // check password cũ ở dạng thường và dạng mã hoá
      if (currentPassword === password) {
        throw new HttpException(
          {
            status: StatusResponse.PASSWORD_INCORRECT,
            message: 'New Password Cannot Be The Same As Current Password',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const udProfile = await this.userModel.findByIdAndUpdate(
        user?._id,
        {
          password: hashPassword,
        },
        {
          new: true,
        },
      );

      return {
        status: StatusResponse.SUCCESS,
        message: 'Update Password Success!',
        data: udProfile,
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new HttpException(
        {
          status: StatusResponse.FAIL,
          err,
        },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async getPaginationUser(query: GetPagination, user: UserDocument) {
    const { pageIndex, pageSize, ...rest } = query;

    const search = { ...rest };

    const filter: any = {};

    // user.role._id.toString() !== adminRole &&
    //   (filter['teams'] = {
    //     $in: [...user.teams.map((t) => new Types.ObjectId(t))],
    //   });
    const limit = pageSize ? pageSize : null;
    const skip = pageIndex ? pageSize * (pageIndex - 1) : null;

    if (Object.keys(search)?.length) {
      filter['$or'] = [
        {
          name: new RegExp(search?.search.toString(), 'i'),
        },
        {
          username: new RegExp(search?.search.toString(), 'i'),
        },
      ];
    }
    const [total, users] = await Promise.all([
      this.userModel.countDocuments({ ...filter, isDelete: false }),
      this.userModel
        .find({
          ...filter,
          isDelete: false,
        })
        .sort({ createdAt: -1 })
        .populate([
          { path: 'role', select: 'name' },
          { path: 'teams', select: '_id name' },
        ])
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    return {
      status: StatusResponse.SUCCESS,
      message: 'Get Paging User Success',
      total,
      users,
    };
  }
}
