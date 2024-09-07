import { IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
export class UpdateUserDto extends PartialType(CreateUserDto) {}
