import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Team, TeamDocument } from './team.entity';
import { Model, Types } from 'mongoose';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Request } from 'express';
import { BaseService } from 'src/base/base.service';
import { UserService } from 'src/modules/users/user.service';

@Injectable()
export class TeamService extends BaseService<TeamDocument> {
  constructor(
    @InjectModel(Team.name) private teamModel: Model<TeamDocument>,
    private readonly userService: UserService,
  ) {
    super(teamModel);
  }
  // private readonly logger = new Logger(TeamService.name);
  // async create(
  //   _team: CreateTeamDto,
  //   user: UserDocument,
  //   request: Request,
  //   userIp: string,
  // ) {
  //   const checkTeam = await this.teamModel.findOne({
  //     name: _team.name,
  //     isDelete: false,
  //   });

  //   if (checkTeam) {
  //     return {
  //       status: StatusResponse.EXISTS_TEAM,
  //       message: 'Team Exist',
  //     };
  //   }

  //   const arrUser = [];
  //   for (const user of _team.managers) {
  //     const checkUser = await this.userService.findOneById(user);
  //     if (!checkUser)
  //       throw new HttpException(
  //         {
  //           status: StatusResponse.USER_BY_ID_NOT_FOUND,
  //           message: `Not Found User By Id : ${user}`,
  //         },
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     arrUser.push(checkUser._id);
  //   }

  //   const team = await this.teamModel.create({
  //     name: _team.name,
  //     user: user._id,
  //     managers: arrUser,
  //   });
  //   await Promise.all(
  //     arrUser.map(async (_user) => {
  //       await this.userService.checkTeamAndAddTeam(team._id, _user);
  //     }),
  //   );

  //   request['message-log'] =
  //     `<b>${user?.username}</b> vừa <b>Tạo Mới</b> 1 <b>Team</b> có thông tin sau:\n<b>Tên</b>: ${
  //       _team.name
  //     }.\nVào lúc: <b>${formatDate(
  //       new Date(),
  //     )}</b>\nIP người thực hiện: ${userIp}.`;
  //   return {
  //     statusCode: HttpStatus.CREATED,
  //     message: 'Create A Team Success',
  //     data: team,
  //   };
  // }
  // async update(
  //   id: Types.ObjectId,
  //   data: UpdateTeamDto,
  //   user: UserDocument,
  //   request: Request,
  //   userIp: string,
  // ) {
  //   const arrUser = [];
  //   if (data.managers.length) {
  //     for (const user of data.managers) {
  //       const checkUser = await this.userService.findOneById(user);
  //       if (!checkUser)
  //         throw new HttpException(
  //           {
  //             status: StatusResponse.USER_BY_ID_NOT_FOUND,
  //             message: `Not Found User By Id : ${user}`,
  //           },
  //           HttpStatus.BAD_REQUEST,
  //         );
  //       arrUser.push(checkUser._id);
  //     }
  //   }
  //   const team = await this.teamModel.findById(id);
  //   if (!team)
  //     throw new HttpException(
  //       {
  //         status: StatusResponse.NOTFOUND,
  //         message: 'Team By Id Not Found',
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   team.name = data.name ?? team.name;
  //   if (arrUser.length !== 0) {
  //     await Promise.all(
  //       team.managers.map(async (_user) => {
  //         await this.userService.checkTeamAndRemoveTeam(team._id, _user);
  //       }),
  //     );
  //     team.managers = arrUser;
  //     await Promise.all(
  //       arrUser.map(async (_user) => {
  //         await this.userService.checkTeamAndAddTeam(team._id, _user);
  //       }),
  //     );
  //   }

  //   await team.save();
  //   request['message-log'] =
  //     `<b>${user?.username}</b> vừa <b>Cập nhật</b> thông tin cho <b>Team</b> có \n<b>Tên</b>: ${
  //       team.name
  //     }.\nVào lúc: <b>${formatDate(
  //       new Date(),
  //     )}</b>\nIP người thực hiện: ${userIp}.`;
  //   return {
  //     status: StatusResponse.SUCCESS,
  //     message: 'Update Team Success',
  //     data: team,
  //   };
  // }
  // async delete(
  //   id: string,
  //   user: UserDocument,
  //   request: Request,
  //   userIp: string,
  // ) {
  //   const idItems: string[] = id.split(',');

  //   try {
  //     const teamTemp = [];
  //     await Promise.all(
  //       idItems?.map(async (tid: string) => {
  //         const tempItem = await this.teamModel.findById(tid);
  //         tempItem.isDelete = true;
  //         teamTemp.push(tempItem);
  //         await tempItem.save();
  //       }),
  //     );
  //     const deletedTeamNames = teamTemp.map((team) => team.name).join(', ');

  //     request['message-log'] = `<b>${user?.username}</b> vừa <b>Xóa</b> ${
  //       teamTemp.length
  //     } <b>Team</b> có:\n<b>Tên</b>: ${deletedTeamNames}.\nVào lúc: <b>${formatDate(
  //       new Date(),
  //     )}</b>\nIP người thực hiện: ${userIp}.`;
  //     return {
  //       status: StatusResponse.SUCCESS,
  //       message: 'Team deleted successfully',
  //     };
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async getById(id: string) {
  //   try {
  //     const result = await this.findOneData({
  //       id,
  //       populate: [
  //         { path: 'user', select: { name: 1, email: 1, username: 1 } },
  //         { path: 'managers', select: { name: 1, email: 1, username: 1 } },
  //       ],
  //     });
  //     return {
  //       statusCode: HttpStatus.OK,
  //       message: 'Get Team successfully',
  //       data: result,
  //     };
  //   } catch (error) {
  //     throw error;
  //   }
  // }
  // async getPaging(query: any) {
  //   const { page = 1, limit = 10, search = '' } = query;
  //   const _query: any = {
  //     isDelete: false,
  //   };

  //   if (search) {
  //     _query['$or'] = [
  //       {
  //         name: {
  //           $regex: `.*${search}.*`,
  //           $options: 'i',
  //         },
  //       },
  //     ];
  //   }

  //   const result = await this.findAllData({
  //     query: {
  //       page: +page,
  //       limit: +limit,
  //     },
  //     filter: _query,
  //     populate: [
  //       { path: 'user', select: { name: 1, email: 1, username: 1 } },
  //       { path: 'managers', select: { name: 1, email: 1, username: 1 } },
  //     ],
  //   });

  //   return {
  //     statusCode: HttpStatus.OK,
  //     message: 'Fetch all teams successfully',
  //     data: result,
  //   };
  // }
  // async getAllYourTeam(user: UserDocument) {
  //   let teams: any;
  //   if (
  //     !!user?.teams?.length ||
  //     ['659ba7c62b611171a5347a97'].includes(user.role._id.toString())
  //   ) {
  //     teams = !['659ba7c62b611171a5347a97'].includes(user.role._id.toString())
  //       ? await this.teamModel.find({
  //           _id: { $in: [...user?.teams] },
  //           isDelete: false,
  //         })
  //       : await this.teamModel.find({ isDelete: false });
  //   } else {
  //     teams = [];
  //   }
  //   return {
  //     status: StatusResponse.SUCCESS,
  //     message: 'Get Your Team List Success',
  //     data: teams,
  //   };
  // }
}
