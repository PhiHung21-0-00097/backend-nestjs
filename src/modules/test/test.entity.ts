import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Role, RoleDocument } from 'src/modules/roles/role.entity';

export type TestDocument = HydratedDocument<Test>;

@Schema({ timestamps: true })
export class Test {
  @Prop({ type: String })
  username: string;

  @Prop({ type: String })
  password: string;
}

export const TestSchema = SchemaFactory.createForClass(Test);
