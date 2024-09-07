import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StatusResponse } from 'src/common/enums/StatusResponse.enum';
import { Request } from 'express';
import { formatDate } from 'src/utils';
import { UserService } from 'src/modules/users/user.service';
import { RoleService } from 'src/modules/roles/roles.service';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { userInterface } from 'src/modules/users/interface/user.interface';
import { LoginUserDto } from 'src/modules/users/dto/login-user.dto';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private roleService: RoleService,
  ) {}
  // async signUp(createUserDto: CreateUserDto, request: Request, userIp: string) {
  //   try {
  //     const { username, email, role } = createUserDto;
  //     const checkEmail = await this.userService.checkEmail(email);
  //     if (checkEmail)
  //       throw new HttpException(
  //         {
  //           status: StatusResponse.EXISTS_EMAIL,
  //           column: 'email',
  //           message: 'Email Already Exists',
  //         },
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     const checkUserName = await this.userService.checkUsername(username);
  //     if (checkUserName)
  //       throw new HttpException(
  //         {
  //           status: StatusResponse.EXISTS_USERNAME,
  //           column: 'username',
  //           message: 'Username Already Exists',
  //         },
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     const checkRole = await this.roleService.checkRoleById(role);
  //     if (!checkRole)
  //       throw new HttpException(
  //         {
  //           status: StatusResponse.NOT_EXISTS_ROLE,
  //           column: 'role',
  //           message: 'Role Is Not Exists',
  //         },
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     const { user } = await this.userService.create(
  //       createUserDto,
  //       request,
  //       userIp,
  //     );

  //     const userData: userInterface = {
  //       usernames: user.usernames,
  //       username: user.username,
  //       role: user.role,
  //     };
  //     return {
  //       status: StatusResponse.SUCCESS,
  //       messsage: 'Create An User Success',
  //       data: userData,
  //     };
  //   } catch (error) {
  //     if (error instanceof HttpException) throw error;
  //     throw new HttpException(
  //       {
  //         status: HttpStatus.BAD_GATEWAY,
  //         error,
  //       },
  //       HttpStatus.BAD_GATEWAY,
  //     );
  //   }
  // }
  // async signIn(_user: LoginUserDto, request: Request, userIp: string) {
  //   try {
  //     const { username, password } = _user;
  //     const user = await this.userService.findByUsername(username);

  //     if (!user)
  //       throw new HttpException(
  //         {
  //           status: StatusResponse.USERNAME_OR_PASSWORD_IS_NOT_CORRECT,
  //           message: 'User Name Or Password Is Not Correct',
  //         },
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     const checkPassword = await this.userService.checkPassword(
  //       password,
  //       user.password,
  //     );
  //     if (!checkPassword)
  //       throw new HttpException(
  //         {
  //           status: StatusResponse.USERNAME_OR_PASSWORD_IS_NOT_CORRECT,
  //           message: 'User Name Or Password Is Not Correct',
  //         },
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     const permission = await this.userService.getUserById(user.id);
  //     const payload = {
  //       username,
  //       email: user.email,
  //       user_id: user._id,
  //     };
  //     const accessToken = await this.jwtService.signAsync(payload);
  //     const refreshToken = await this.jwtService.signAsync(payload, {
  //       expiresIn: process.env.EXPIRES_REFRESH_TOKEN_JWT,
  //       secret: process.env.SECRECT_JWT_REFRESH_TOKEN,
  //     });
  //     const userData: userInterface = {
  //       usernames: user.usernames,
  //       username: user.username,
  //     };
  //     let stringLog = `${user?.username} vừa đăng nhập.\nVào lúc: <b>${formatDate(
  //       new Date(),
  //     )}</b>\nIP người thực hiện: ${userIp}.`;
  //     request['message-log'] = stringLog;
  //     request['user'] = user;
  //     return {
  //       accessToken,
  //       refreshToken,
  //       userId: user._id,
  //       status: StatusResponse.SUCCESS,
  //       message: 'Login Success',
  //       role: permission.role._id,
  //       permission: permission.permission,
  //       userData,
  //     };
  //   } catch (error) {
  //     if (error instanceof HttpException) throw error;
  //     throw new HttpException(
  //       {
  //         status: HttpStatus.BAD_GATEWAY,
  //         error,
  //       },
  //       HttpStatus.BAD_GATEWAY,
  //     );
  //   }
  // }
}
