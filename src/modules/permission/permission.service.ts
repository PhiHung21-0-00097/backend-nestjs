import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { CreatePermissionDto } from './dto/create-permisstion.dto';
import { UpdatePermisstionDto } from './dto/update-permisstion.dto';
import { CreatePermissionRoleDto } from './dto/create-permission-role.dto';
import { UpdatePermissionRoleDto } from './dto/update-permission-role.dto';
import { adminRole, permisstionDefault } from 'src/constants';
import { Permission, PermissionDocument } from './permission.entity';
import { StatusResponse } from 'src/common/enums/StatusResponse.enum';
import { ActionEnum, actionMapping } from 'src/common/enums/ActionsRole.enum';
import { Request } from 'express';
import { subjectMapping } from 'src/common/enums/SubjectRoles.enum';
import { Role, RoleDocument } from 'src/modules/roles/role.entity';
import { UserDocument } from 'src/modules/users/user.entity';
import { formatDate } from 'src/utils';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<PermissionDocument>,
    @InjectModel(Role.name)
    private readonly roleModel: Model<RoleDocument>,
  ) {}
  private readonly logger = new Logger(PermissionService.name);
  onModuleInit() {
    this.initPermissionEntity();
  }
  async initPermissionEntity() {
    try {
      const check = await this.permissionModel.countDocuments();
      if (check === 0) {
        for (const data of permisstionDefault) {
          const existingPermisstion = await this.permissionModel.findById(
            new Types.ObjectId(data._id),
          );
          if (!existingPermisstion) {
            await this.permissionModel.create({
              ...data,
              role: new Types.ObjectId(data?.role),
            });
          }
        }
      }
      this.logger.verbose('Khởi tạo data cho permission entity thành công');
    } catch (error) {
      this.logger.error('Không thể khởi tạo data cho permission entity');
    }
  }
  async getPermissionByRole(roleId: Types.ObjectId) {
    return this.permissionModel.find({ role: roleId });
  }
  findOneBy(filter: FilterQuery<PermissionDocument>) {
    return this.permissionModel.findOne(filter);
  }
  async getAllByRoleId(id: string) {
    try {
      const permissions = await this.permissionModel.find({
        role: new Types.ObjectId(id),
      });
      return {
        status: StatusResponse.SUCCESS,
        messsage: 'Get Permissions By Role Id Success',
        data: permissions,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        { status: HttpStatus.BAD_GATEWAY, error },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
  async createPermissionRole(
    permission: CreatePermissionRoleDto,
    user: UserDocument,
    request: Request,
    userIp: string,
  ) {
    try {
      if (!permission.role)
        throw new HttpException(
          {
            status: StatusResponse.FAIL,
            message: 'Role Name Is Not Empty',
          },
          HttpStatus.BAD_REQUEST,
        );
      const checkRole = await this.roleModel.findOne({
        name: permission.role,
      });
      if (checkRole)
        throw new HttpException(
          {
            status: StatusResponse.FAIL,
            message: 'Role Name Adready Exist',
          },
          HttpStatus.BAD_REQUEST,
        );

      const role = await this.roleModel.create({ name: permission.role });
      let newData = `Tên role: ${role.name}\n`;
      if (!!Object.entries(permission.permission).length)
        newData += `Với các quyền hạn cụ thể sau:\n`;
      const permissions = [];
      for (const [key, value] of Object.entries(permission.permission)) {
        if (value.some((e) => e === ActionEnum.MANAGE)) {
          const _permission = await this.permissionModel.create({
            role: role._id,
            action: [ActionEnum.MANAGE],
            subject: key,
          });
          newData += `${subjectMapping[key]} : ${actionMapping['manage']}\n`;
          permissions.push(_permission);
        } else {
          const _permission = await this.permissionModel.create({
            role: role._id,
            action: [...value],
            subject: key,
          });
          newData += `${subjectMapping[key]} : ${!!value?.length ? [...value].map((val) => actionMapping[val])?.join(', ') : '(Trống)'}\n`;
          permissions.push(_permission);
        }
      }
      let stringLog = `${user?.username} vừa tạo mới role và quyền hạn với các thông tin sau:\n${newData}\nVào lúc: <b>${formatDate(
        new Date(),
      )}</b>\nIP người thực hiện: ${userIp}.`;
      request['new-data'] = newData;
      request['message-log'] = stringLog;
      return {
        status: StatusResponse.SUCCESS,
        messsage: 'Create  Permission Success',
        data: {
          role,
          permissions,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        { status: HttpStatus.BAD_GATEWAY, error },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
  async createPermission(
    permission: CreatePermissionDto,
    user: UserDocument,
    request: Request,
    userIp: string,
  ) {
    try {
      const { role, subject, action } = permission;
      const _role = await this.roleModel.findById(new Types.ObjectId(role));
      if (!_role)
        throw new HttpException(
          {
            status: StatusResponse.FAIL,
            message: `Not Found Role By Id: ${role}`,
          },
          HttpStatus.BAD_REQUEST,
        );
      if (role === adminRole)
        throw new ForbiddenException({
          message: "You Don't Have Permission To Change Admin Role",
        });
      const checkExists = await this.permissionModel.findOne({
        role: new Types.ObjectId(role),
        subject,
      });
      if (checkExists)
        throw new HttpException(
          {
            status: StatusResponse.FAIL,
            message: 'This Role And Subject Already Exists In Database',
          },
          HttpStatus.BAD_REQUEST,
        );

      const _permission = await this.permissionModel.create({
        role: _role._id,
        action,
        subject,
      });
      let newData = `${subjectMapping[subject]} : ${!!action?.length ? [...action].map((val) => actionMapping[val])?.join(', ') : '(Trống)'}\n`;
      let stringLog = `${user?.username} vừa tạo mới quyền hạn cho role ${_role.name} với các thông tin sau :\n${newData}\nVào lúc: <b>${formatDate(
        new Date(),
      )}</b>\nIP người thực hiện: ${userIp}.`;
      request['new-data'] = `tên role: ${_role.name},\n${newData}`;
      request['message-log'] = stringLog;
      return {
        status: StatusResponse.SUCCESS,
        messsage: 'Create A Permission Success',
        data: _permission,
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
    user: UserDocument,
    request: Request,
    userIp: string,
  ) {
    try {
      const permission = await this.permissionModel
        .findById(new Types.ObjectId(id))
        .populate('role');

      if (!permission)
        throw new HttpException(
          {
            status: StatusResponse.FAIL,
            message: 'Permission Id Not Found',
          },
          HttpStatus.BAD_REQUEST,
        );
      if ((permission.role as any as Types.ObjectId)?.toString() === adminRole)
        throw new HttpException(
          {
            message: `You Don't Have Permission To Change Admin Role's Permission`,
            status: HttpStatus.FORBIDDEN,
          },
          HttpStatus.FORBIDDEN,
        );
      await permission.deleteOne();
      let stringLog = `${user?.username} vừa xóa quyền hạn ${subjectMapping[permission.subject]} của role ${permission.role.name}\nVào lúc: <b>${formatDate(
        new Date(),
      )}</b>\nIP người thực hiện: ${userIp}.`;
      const oldData = `Tên role: ${permission.role.name},\n${subjectMapping[permission.subject]} : ${!!permission.action?.length ? [...permission.action].map((val) => actionMapping[val])?.join(', ') : '(Trống)'}\n`;
      request['old-data'] = oldData;
      request['message-log'] = stringLog;
      return {
        status: StatusResponse.SUCCESS,
        message: 'Permission Deleted Success',
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        { status: HttpStatus.BAD_GATEWAY, error },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
  async updateById(
    id: string,
    permission: UpdatePermisstionDto,
    user: UserDocument,
    request: Request,
    userIp: string,
  ) {
    try {
      const _permission = await this.permissionModel
        .findById(new Types.ObjectId(id))
        .populate('role');
      const oldData = `Tên role: ${_permission.role.name},\n${subjectMapping[_permission.subject]} : ${_permission.action?.length ? [..._permission.action].map((val) => actionMapping[val])?.join(', ') : '(Trống)'}\n`;
      if (!permission)
        throw new HttpException(
          {
            status: StatusResponse.FAIL,
            message: 'Permission Id Is Not Found',
          },
          HttpStatus.BAD_REQUEST,
        );
      if ((_permission.role as any as Types.ObjectId)?.toString() === adminRole)
        throw new HttpException(
          {
            message: `You Don't Have Permission To Change Admin Role's Permission`,
            status: HttpStatus.FORBIDDEN,
          },
          HttpStatus.FORBIDDEN,
        );
      const { action, subject } = permission;
      _permission.action = action;
      _permission.subject = subject;
      _permission.save();
      const newData = `Tên role: ${_permission.role.name},\n${subjectMapping[_permission.subject]} : ${!!_permission.action?.length ? [..._permission.action].map((val) => actionMapping[val])?.join(', ') : '(Trống)'}\n`;
      let stringLog = `${user?.username} vừa cập nhật quyền hạn\nVào lúc: <b>${formatDate(
        new Date(),
      )}</b>\nIP người thực hiện: ${userIp}.`;
      request['new-data'] = newData;
      request['old-data'] = oldData;
      request['message-log'] = stringLog;
      return {
        status: StatusResponse.SUCCESS,
        message: 'Update Permission Success',
        data: _permission,
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
  async getById(id: string) {
    try {
      const permission = await this.permissionModel.findById(
        new Types.ObjectId(id),
      );
      if (!permission)
        throw new HttpException(
          {
            status: StatusResponse.FAIL,
            message: 'Permission Id Is Not Found',
          },
          HttpStatus.BAD_REQUEST,
        );
      return {
        status: StatusResponse.SUCCESS,
        message: 'Get Permission By Id Success',
        data: permission,
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
  async GetAll() {
    try {
      const permissions = await this.permissionModel.find();
      return {
        status: StatusResponse.SUCCESS,
        message: 'Get All PerMission Success',
        data: permissions,
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
  async updatePermissionByRoleId(
    id: string,
    permission: UpdatePermissionRoleDto,
    user: UserDocument,
    request: Request,
    userIp: string,
  ) {
    try {
      if (id === adminRole)
        throw new ForbiddenException({
          message: "You Don't Have Permission To Change Admin Role",
        });
      const role = await this.roleModel.findById(new Types.ObjectId(id));
      if (!role)
        throw new HttpException(
          {
            status: StatusResponse.NOT_EXISTS_ROLE,
            message: `Role Id : ${id} Not Exists`,
          },
          HttpStatus.BAD_GATEWAY,
        );
      const checkRoleName = await this.roleModel.findOne({
        _id: { $ne: role._id },
        name: permission.role,
      });
      let oldData = `Tên role: ${role.name}\n`;

      if (checkRoleName)
        throw new HttpException(
          {
            status: StatusResponse.FAIL,
            message: 'Role Name Adready Exist',
          },
          HttpStatus.BAD_REQUEST,
        );
      role.name = permission.role;
      const permissions = [];
      const oldPermissions = await this.permissionModel.find({
        role: role._id,
      });
      if (!!oldPermissions.length) oldData += `Với các quyền hạn cụ thể sau:\n`;
      else oldData += 'Chưa khởi tạo quyền hạn nào.';

      for (const pers of oldPermissions)
        oldData += `${subjectMapping[pers.subject]} : ${!!pers.action?.length ? [...pers.action].map((val) => actionMapping[val])?.join(', ') : '(Trống)'}\n`;
      let newData = `Tên role: ${role.name}\n`;
      if (!!Object.entries(permission.permission).length)
        newData += `Với các quyền hạn cụ thể sau:\n`;
      else newData += `Chưa khởi tạo quyền hạn nào`;
      for (const [key, value] of Object.entries(permission.permission)) {
        if (value.some((e) => e === ActionEnum.MANAGE)) {
          const _permission =
            (await this.permissionModel.findOneAndUpdate(
              {
                role: new Types.ObjectId(id),
                subject: key,
              },
              {
                action: [ActionEnum.MANAGE],
                subject: key,
              },
              { new: true },
            )) ||
            (await this.permissionModel.create({
              role: new Types.ObjectId(id),
              action: [ActionEnum.MANAGE],
              subject: key,
            }));
          newData += `${subjectMapping[key]} : ${actionMapping['manage']}\n`;
          permissions.push(_permission);
        } else {
          const _permission =
            (await this.permissionModel.findOneAndUpdate(
              {
                role: new Types.ObjectId(id),
                subject: key,
              },
              {
                action: [...value],
                subject: key,
              },
              { new: true },
            )) ||
            (await this.permissionModel.create({
              role: new Types.ObjectId(id),
              action: [...value],
              subject: key,
            }));
          newData += `${subjectMapping[key]} : ${!!value?.length ? [...value].map((val) => actionMapping[val])?.join(', ') : '(Trống)'}\n`;
          permissions.push(_permission);
        }
      }
      await role.save();
      let stringLog = `${user?.username} vừa cập nhật role và quyền hạn với các thông tin sau:
            \n${newData}\nVào lúc: <b>${formatDate(
              new Date(),
            )}</b>\nIP người thực hiện: ${userIp}.`;
      request['new-data'] = newData;
      request['old-data'] = oldData;
      request['message-log'] = stringLog;
      return {
        status: StatusResponse.SUCCESS,
        messsage: 'Update Permission Success',
        data: {
          role,
          permissions,
        },
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
