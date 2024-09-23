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
    try {
      const users = await this.userModel.find({ isDelete: false });
      return {
        status: StatusResponse.SUCCESS,
        message: 'Get All User Success',
        data: users,
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new HttpException(
        {
          status: StatusResponse.FAIL,
          err,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
      const teams = [];
      let logTeam = `(Trống)`;
      if (createUserDto.hasOwnProperty('teams')) {
        const arrTeamName = [];
        for (const team of createUserDto.teams) {
          const checkTeam = await this.teamModel.findById(
            new Types.ObjectId(team),
          );
          if (!checkTeam) continue;
          arrTeamName.push(`${checkTeam.name}`);
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
    try {
      const { pageSize, pageIndex, ...rest } = query;

      const search = { ...rest };

      const filter: any = {};

      const limit = pageSize ? pageSize : null;

      const skip = pageIndex ? pageSize + (pageIndex - 1) : null;
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
}
