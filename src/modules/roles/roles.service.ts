import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { StatusResponse } from 'src/common/enums/StatusResponse.enum';
import { adminRole, roleDefault } from 'src/constants';
import { CreateRoleDto } from 'src/modules/roles/dto/create-role.dto';
import { UpdateRoleDto } from 'src/modules/roles/dto/update-role.dto';
import { Role } from 'src/modules/roles/role.entity';
import { UserDocument } from 'src/modules/users/user.entity';
import { formatDate } from 'src/utils';
import { Permission } from 'src/modules/permission/permission.entity';
@Injectable()
export class RoleService {
  constructor(
    @InjectModel('Role')
    private rolesModel: Model<Role>,
    @InjectModel('Permission') private permissionModel: Model<Permission>,
  ) {}
  onModuleInit() {
    this.initPackageEntity();
  }
  private readonly logger = new Logger(RoleService.name);

  async initPackageEntity() {
    try {
      for (const data of roleDefault) {
        const existingRole = await this.rolesModel.findById(
          new Types.ObjectId(data._id),
        );
        if (!existingRole) {
          await this.rolesModel.create(data);
        }
      }
      this.logger.verbose('Khởi tạo data cho role entity thành công');
    } catch (error) {
      this.logger.error('Không thể khởi tạo data cho role entity');
    }
  }

  async checkRoleById(id: string) {
    if (id === adminRole)
      throw new HttpException(
        {
          message: `You Don't Have Permission To Change Admin Role`,
          status: HttpStatus.FORBIDDEN,
        },
        HttpStatus.FORBIDDEN,
      );
    return await this.rolesModel.findById(new Types.ObjectId(id));
  }

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

  async update(
    _role: UpdateRoleDto,
    id: string,
    request: Request,
    userIp: string,
    user: UserDocument,
  ) {
    try {
      if (id === adminRole)
        throw new HttpException(
          {
            message: `You Don't Have Permission To Change Admin Role`,
            status: HttpStatus.FORBIDDEN,
          },
          HttpStatus.FORBIDDEN,
        );
      const role = await this.rolesModel.findById(new Types.ObjectId(id));
      if (!role)
        throw new HttpException(
          {
            status: StatusResponse.FAIL,
            message: 'Role By Id Is Not Exists',
          },
          HttpStatus.BAD_REQUEST,
        );
      const oldData = `Tên role: ${role.username}\n`;
      const checkName = await this.rolesModel.findOne({
        username: _role.username,
      });
      if (checkName)
        throw new HttpException(
          {
            status: StatusResponse.FAIL,
            message: 'Role Name Already Exists',
          },
          HttpStatus.BAD_REQUEST,
        );
      role.username = _role.username;
      const newData = `Tên role: ${role.username}\n`;
      let stringLog = `${user?.username} vừa cập nhật role với các thông tin:\n${newData}\nVào lúc: <b>${formatDate(
        new Date(),
      )}</b>\nIP người thực hiện: ${userIp}.`;
      request['new-data'] = newData;
      request['old-data'] = oldData;
      request['message-log'] = stringLog;
      await role.save();
      return {
        status: StatusResponse.SUCCESS,
        message: 'Update Role Success',
        data: role,
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

  async delete(
    id: string,
    request: Request,
    userIp: string,
    user: UserDocument,
  ) {
    try {
      if (id === adminRole)
        throw new ForbiddenException({
          message: "You Don't Have Permission To Delete Admin Role",
        });
      const role = await this.rolesModel.findByIdAndDelete(
        new Types.ObjectId(id),
      );
      if (!role) {
        throw new HttpException(
          {
            status: StatusResponse.FAIL,
            message: 'Role By Id Not Exists',
          },
          HttpStatus.BAD_GATEWAY,
        );
      }

      await this.permissionModel.deleteMany({
        role: new Types.ObjectId(id),
      });
      let stringLog = `${user?.username} vừa xóa role có tên ${role.username}\nVào lúc: <b>${formatDate(
        new Date(),
      )}</b>\nIP người thực hiện: ${userIp}.`;
      const oldData = `Tên role: ${role.username}\n`;
      request['old-data'] = oldData;
      request['message-log'] = stringLog;
      return {
        status: StatusResponse.SUCCESS,
        message: 'Role Deleted Successfully!',
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
