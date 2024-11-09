import { IsNumber, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { IsObjectId } from 'src/validators/isValidObjectId.validator';

export class CreateProductDto {
  @IsString({ message: 'Please Enter User Name' })
  name: string;
  @IsNumber()
  price: number;
  @IsString()
  image: string;
  @IsObjectId({ message: 'Brand Is Not Valid Value' })
  @IsString({ message: 'Please Enter User brand' })
  brand: Types.ObjectId;
  @IsString({ message: 'Please Enter User color' })
  color: string;
  @IsString({ message: 'Please Enter User carLine' })
  carLine: string;
}
