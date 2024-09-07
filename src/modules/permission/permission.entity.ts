import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ActionEnum } from 'src/common/enums/ActionsRole.enum';
import { SubjectEnum } from 'src/common/enums/SubjectRoles.enum';
import { Role, RoleDocument } from 'src/modules/roles/role.entity';

export type PermissionDocument = HydratedDocument<Permission>;
@Schema({ timestamps: true })
export class Permission {
  @Prop({ type: Types.ObjectId, ref: Role.name, required: true })
  role: RoleDocument;

  @Prop({ type: [String], enum: ActionEnum, required: true, default: [] })
  action: string[];

  @Prop({ type: String, enum: SubjectEnum, required: true })
  subject: string;
}
export const PermissionSchema = SchemaFactory.createForClass(Permission);
