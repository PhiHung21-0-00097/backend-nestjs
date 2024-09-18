import { IsArray, IsMongoId, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateRoleDto {
  @IsNotEmpty()
  name: string;
}
