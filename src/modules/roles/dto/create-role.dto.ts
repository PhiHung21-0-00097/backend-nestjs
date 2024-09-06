import { IsArray, IsMongoId, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateRoleDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  desc: string;

  @IsNotEmpty()
  @IsMongoId({ each: true })
  @IsArray()
  permissions: Types.ObjectId[];
}
