import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Role, RoleDocument } from 'src/modules/roles/role.entity';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  usernames: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true })
  username: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: Types.ObjectId, ref: Role.name, required: true })
  role: RoleDocument;

  @Prop({ type: Boolean, default: false })
  isDelete: boolean;

  @Prop({ type: String, default: '' })
  ipUserConfirmOtp: string;

  @Prop({ type: String, default: '' })
  otp: string;

  @Prop({ type: Date, default: null })
  otpExpiration: Date;
  @Prop({ type: [Types.ObjectId], ref: 'Team', default: [] })
  teams: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
