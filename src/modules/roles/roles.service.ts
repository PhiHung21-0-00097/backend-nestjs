import { Injectable } from '@nestjs/common';
import { Role, RoleDocument } from 'src/modules/roles/schemas/roles.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name)
    private rolesModel: Model<RoleDocument>,
  ) {}
  async createRole() {
    const role = new this.rolesModel({ name: 'admin1', isActive: true });
    return role.save();
  }
}
