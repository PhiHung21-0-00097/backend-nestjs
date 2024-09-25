import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateTeamDto {
  @IsNotEmpty()
  name: string;

  // @IsArray()
  // @IsNotEmpty()
  // @IsString({ each: true, message: 'manager must be string' })
  // managers: string[] = [];
}
