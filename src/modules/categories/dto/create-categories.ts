import { IsNotEmpty, IsNumber, MinLength } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCategoryDto {
  _id?: Types.ObjectId;
  @MinLength(5, { message: 'Phải có ít nhất 5 kí tự đó đồ ngốc!' })
  name?: string;
  @IsNotEmpty({ message: 'Giá mà rỗng ko lẽ mua free hả cha!' })
  @IsNumber({}, { message: 'Giá mà để kiểu chữ là sao nữa dị trừi!' })
  price?: number;
}
