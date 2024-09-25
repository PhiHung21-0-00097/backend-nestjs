import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TeamDocument = HydratedDocument<Team>;
@Schema({ timestamps: true })
export class Team {
  @Prop()
  name: string;
}
export const TeamSchema = SchemaFactory.createForClass(Team);
