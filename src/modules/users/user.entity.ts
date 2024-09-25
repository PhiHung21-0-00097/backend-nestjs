import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Role, RoleDocument } from 'src/modules/roles/role.entity';
import { Team, TeamDocument } from 'src/team/team.entity';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  username: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  email: string;

  @Prop({
    type: Types.ObjectId,
    ref: Role.name,
  })
  role: RoleDocument;

  @Prop({ type: Boolean, default: false })
  isDelete: boolean;

  // @Prop({ type: [Types.ObjectId], ref: 'Team', default: [] })
  @Prop({
    type: Types.ObjectId,
    ref: Team.name,
  })
  team: TeamDocument;
}

export const UserSchema = SchemaFactory.createForClass(User);
