import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Role } from 'src/modules/roles/schemas/roles.schema';

export type UserDocument = HydratedDocument<Users>;

@Schema({ timestamps: true })
export class Users {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  age: number;

  @Prop()
  gender: string;

  @Prop()
  address: string;

  @Prop()
  phone: string;

  @Prop({ type: Types.ObjectId, ref: Role.name })
  role: Types.ObjectId;

  @Prop()
  refresh_token: string;
}

export const UserSchema = SchemaFactory.createForClass(Users);
