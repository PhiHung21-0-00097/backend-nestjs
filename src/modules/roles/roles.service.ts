import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { StatusResponse } from 'src/common/enums/StatusResponse.enum';
import { CreateRoleDto } from 'src/modules/roles/dto/create-role.dto';
import { Role } from 'src/modules/roles/role.entity';
import { UserDocument } from 'src/modules/users/user.entity';
import { formatDate } from 'src/utils';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel('Role')
    private rolesModel: Model<Role>,
  ) {}
  // onModuleInit() {
  //   this.initPackageEntity();
  // }
  private readonly logger = new Logger(RoleService.name);
  async create(
    createRoleDto: CreateRoleDto,
    request: Request,
    userIp: string,
    user: UserDocument,
  ) {
    try {
      const { username } = createRoleDto;
      const checkRole = await this.rolesModel.findOne({ username });
      if (checkRole)
        throw new HttpException(
          {
            status: StatusResponse.FAIL,
            message: 'Already Exist Role',
          },
          HttpStatus.BAD_GATEWAY,
        );
      const role = await this.rolesModel.create(createRoleDto);
      const newData = `Tên role: ${username}`;
      let stringLog = `${user?.usernames} vừa tạo mới role với các thông tin:\n${newData}\nVào lúc: <b>${formatDate(
        new Date(),
      )}</b>\nIP người thực hiện: ${userIp}.`;
      request['new-data'] = newData;
      request['message-log'] = stringLog;
      console.log('role: ', role);
      return {
        status: StatusResponse.SUCCESS,
        message: 'Create Role Success',
        data: role,
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new HttpException(
        {
          status: HttpStatus.BAD_GATEWAY,
          err,
        },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async getAllRole() {
    try {
      const roles = await this.rolesModel.find();
      return {
        status: StatusResponse.SUCCESS,
        message: 'Get List Role successfully',
        data: roles,
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new HttpException(
        {
          status: HttpStatus.BAD_GATEWAY,
          err,
        },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async getById(id: string) {
    try {
      const role = await this.rolesModel.findById(new Types.ObjectId(id));
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
          status: HttpStatus.BAD_GATEWAY,
          err,
        },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
