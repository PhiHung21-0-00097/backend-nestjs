import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Category {
  @Prop({ type: String, required: true })
  name: string;
  @Prop({ type: String, required: true })
  price: number;
}
