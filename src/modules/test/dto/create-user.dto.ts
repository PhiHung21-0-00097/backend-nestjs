import { IsOptional } from 'class-validator';

export class CreateLogin {
  @IsOptional()
  username: string;
  @IsOptional()
  password: string;
}
