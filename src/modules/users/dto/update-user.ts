import { IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateUserDto {
  @IsOptional({ message: 'Vui lòng nhập tên' })
  username: string;

  @IsOptional({ message: 'Vui lòng nhập role' })
  //   @IsMongoId()
  role: Types.ObjectId;
}
