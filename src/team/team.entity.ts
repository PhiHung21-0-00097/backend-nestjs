import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserDocument } from 'src/modules/users/user.entity';
export type TeamDocument = HydratedDocument<Team>;
@Schema({ timestamps: true })
export class Team {
  @Prop({ type: String, required: true })
  name: string; //tên team

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: UserDocument | Types.ObjectId;

  @Prop({ type: Boolean, default: false })
  isDelete: boolean;

  @Prop({ type: [Types.ObjectId], ref: 'User' })
  managers: UserDocument[] | Types.ObjectId[];
}
export const TeamSchema = SchemaFactory.createForClass(Team);
