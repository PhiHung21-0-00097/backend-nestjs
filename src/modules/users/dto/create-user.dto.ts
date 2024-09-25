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
export class CreateUserDto {
  @IsNotEmpty({ message: 'User Name Is Not Empty' })
  @IsString({ message: 'Please Enter User Name' })
  username: string;

  @IsNotEmpty({ message: 'Password Is Not Empty' })
  @IsString({ message: 'Please Enter Password' })
  password: string;

  @IsNotEmpty({ message: 'Your Full Name Is Not Empty' })
  @IsString({ message: 'Please Enter Your Full Name' })
  name: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString({ message: 'Please Select Your Role' })
  @IsObjectId({ message: 'Role Is Not Valid Value' })
  role: Types.ObjectId;

  @IsOptional()
  // @IsArray({ message: "User's Teams Must Be An Array" })
  // @Validate(IsObjectId, {
  //   each: true,
  //   message: 'Each Team ID must be a valid ObjectId',
  // })
  @IsOptional()
  @IsString({ message: 'Please Select Your Team' })
  @IsObjectId({ message: 'Team Is Not Valid Value' })
  team: Types.ObjectId;
}
