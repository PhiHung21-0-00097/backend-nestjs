import { IsOptional } from 'class-validator';

export class LoginUserDto {
  @IsOptional()
  email: string;
  @IsOptional()
  username: string;
  @IsOptional()
  password: string;
}
