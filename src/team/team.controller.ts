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
import { SubjectEnum } from 'src/common/enums/SubjectRoles.enum';
import { ActionEnum } from 'src/common/enums/ActionsRole.enum';
import { ActionLogEnum } from 'src/common/enums/ActionLog.enum';
import { UserDocument } from 'src/modules/users/user.entity';
import { GetClientIP } from 'src/decorators/client-ip.decorator';
import { ResponseMessage } from 'src/decorators/response_message.decorator';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}
  @Post()
  @ResponseMessage('Create a new Team')
  async create(
    @Body() team: CreateTeamDto,
    @Req() request: Request,
    @GetClientIP() userIp: string,
    @AuthUser() user: UserDocument,
  ) {
    return this.teamService.create(team, request, userIp, user);
  }

  @Get('get-all')
  @ResponseMessage('Get All a Team')
  async getAllTeam() {
    return this.teamService.getAllTeam();
  }
}
