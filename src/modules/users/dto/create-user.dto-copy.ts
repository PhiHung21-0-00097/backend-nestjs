import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsArray,
  Validate,
} from 'class-validator';
import { Types } from 'mongoose';
import { IsObjectId } from 'src/validators/isValidObjectId.validator';
export class CreateUserDtoCopy {
  username: string;

  password: string;

  // @IsArray({ message: "User's Teams Must Be An Array" })
  // @Validate(IsObjectId, {
  //   each: true,
  //   message: 'Each Team ID must be a valid ObjectId',
  // })
  // teams: Types.ObjectId[] = [];
}
