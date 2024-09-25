import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Team, TeamDocument } from './team.entity';
import { Model, Types } from 'mongoose';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Request } from 'express';
import { BaseService } from 'src/base/base.service';
import { UserService } from 'src/modules/users/user.service';
import { UserDocument } from 'src/modules/users/user.entity';
import { StatusResponse } from 'src/common/enums/StatusResponse.enum';
import { CreateRoleDto } from 'src/modules/roles/dto/create-role.dto';
import { formatDate } from 'src/utils';

@Injectable()
export class TeamService extends BaseService<TeamDocument> {
  constructor(
    @InjectModel(Team.name) private teamModel: Model<TeamDocument>,
    private readonly userService: UserService,
  ) {
    super(teamModel);
  }
  private readonly logger = new Logger(TeamService.name);

  async create(
    createRoleDto: CreateRoleDto,
    request: Request,
    userIp: string,
    user: UserDocument,
  ) {
    try {
      const { name } = createRoleDto;
      console.log('name: ', name);

      const checkRole = await this.teamModel.findOne({ name });
      if (checkRole)
        throw new HttpException(
          {
            status: StatusResponse.FAIL,
            message: 'Already Exist Username',
          },
          HttpStatus.BAD_GATEWAY,
        );

      const role = await this.teamModel.create(createRoleDto);

      return {
        status: StatusResponse.SUCCESS,
        message: 'Create Role Success',
        data: role,
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new HttpException(
        {
          status: HttpStatus.BAD_GATEWAY,
          err,
        },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async getAllTeam() {
    const team = await this.teamModel.find();
    return {
      status: StatusResponse.SUCCESS,
      message: 'Get All Team Success',
      data: team,
    };
  }
}
