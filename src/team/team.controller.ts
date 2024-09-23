import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { Authorization } from 'src/decorators/authorization.decorator';
import { Logging } from 'src/decorators/logging.decorator';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { ObjectIdValidationPipe } from 'src/pipes/isValidObjectId.pipe';
import { Request } from 'express';
import { Types } from 'mongoose';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}
  // @Authorization(SubjectEnum.TEAM, ActionEnum.CREATE)
  // @Post()
  // @Logging('Tạo mới Team', ActionLogEnum.CREATE, SubjectEnum.TEAM)
  // async create(
  //   @Body() team: CreateTeamDto,
  //   @AuthUser() user: UserDocument,
  //   @Req() request: Request,
  //   @GetClientIP() userIp: string,
  // ) {
  //   return this.teamService.create(team, user, request, userIp);
  // }

  // @Authorization(SubjectEnum.TEAM, ActionEnum.UPDATE)
  // @Put('/:id')
  // @Logging(
  //   'Cập nhật team có id: /id/',
  //   ActionLogEnum.UPDATE,
  //   SubjectEnum.TEAM,
  //   ['id'],
  // )
  // async update(
  //   @Body() team: UpdateTeamDto,
  //   @Param('id', ObjectIdValidationPipe) id: Types.ObjectId,
  //   @Req() request: Request,
  //   @GetClientIP() userIp: string,
  //   @AuthUser() user: UserDocument,
  // ) {
  //   return this.teamService.update(id, team, user, request, userIp);
  // }

  // @Authorization(SubjectEnum.TEAM, ActionEnum.DELETE)
  // @Delete('/:id')
  // @Logging('Xóa team có id: /id/', ActionLogEnum.DELETE, SubjectEnum.TEAM, [
  //   'id',
  // ])
  // async delete(
  //   @Param('id') id: string,
  //   @AuthUser() user: UserDocument,
  //   @Req() request: Request,
  //   @GetClientIP() userIp: string,
  // ) {
  //   return this.teamService.delete(id, user, request, userIp);
  // }

  // @Authorization(SubjectEnum.TEAM, ActionEnum.READ)
  // @Get('get-paging')
  // async getPaging(@Query() query: any) {
  //   return this.teamService.getPaging(query);
  // }
  // @Get('/get-all-your-team')
  // @Authorization()
  // async getAllYourTeam(@AuthUser() user: UserDocument) {
  //   return this.teamService.getAllYourTeam(user);
  // }
  // @Get(':id')
  // async getById(@Param('id', ObjectIdValidationPipe) id: string) {
  //   return this.teamService.getById(id);
  // }
}
