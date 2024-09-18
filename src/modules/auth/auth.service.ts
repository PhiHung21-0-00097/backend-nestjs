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

  async signUp(createUserDto: CreateUserDto, request: Request, userIp: string) {
    try {
      const { username, email, role } = createUserDto;
      if (email) {
        const checkemail = await this.userService.checkEmail(email);
        if (checkemail)
          throw new HttpException(
            {
              status: StatusResponse.EXISTS_EMAIL,
              message: 'Email Already Exists',
              column: 'email',
            },
            HttpStatus.BAD_GATEWAY,
          );
      }
      const checkUsername = await this.userService.checkUsername(username);
      if (checkUsername)
        throw new HttpException(
          {
            status: StatusResponse.EXISTS_USERNAME,
            column: 'username',
            message: 'Username Already Exists',
          },
          HttpStatus.BAD_GATEWAY,
        );
      const checkRole = await this.roleService.checkRoleById(role.toString());
      // if (!checkRole)
      //   throw new HttpException(
      //     {
      //       status: StatusResponse.NOT_EXISTS_ROLE,
      //       column: 'role',
      //       message: 'Role Is Not Exists',
      //     },
      //     HttpStatus.BAD_GATEWAY,
      //   );

      const { user } = await this.userService.create(
        createUserDto,
        request,
        userIp,
      );

      const userData: userInterface = {
        username: user.username,
        name: user.name,
        role: user.role,
      };

      return {
        status: StatusResponse.SUCCESS,
        messsage: 'Create An User Success',
        data: userData,
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new HttpException(
        {
          status: StatusResponse.FAIL,
          err,
        },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async signIn(_user: LoginUserDto, request: Request, userIp: string) {
    try {
      const { username, password } = _user;
      const user = await this.userService.findByUsername(username);

      if (!user)
        throw new HttpException(
          {
            status: StatusResponse.USERNAME_OR_PASSWORD_IS_NOT_CORRECT,
            message: 'User Is Not Correct',
          },
          HttpStatus.BAD_GATEWAY,
        );

      const checkPassword = await this.userService.checkPassword(
        password,
        user.password,
      );

      if (!checkPassword)
        throw new HttpException(
          {
            status: StatusResponse.USERNAME_OR_PASSWORD_IS_NOT_CORRECT,
            message: 'Password Is Not Correct',
          },
          HttpStatus.BAD_REQUEST,
        );
      const payload = {
        username,
        email: user.email,
        user_id: user._id,
      };

      const accressToken = await this.jwtService.signAsync(payload, {
        expiresIn: process.env.EXPIRES_REFRESH_TOKEN_JWT,
        secret: process.env.SECRECT_JWT_REFRESH_TOKEN,
      });
      const refreshToken = await this.jwtService.signAsync(payload, {
        expiresIn: process.env.EXPIRES_REFRESH_TOKEN_JWT,
        secret: process.env.SECRECT_JWT_REFRESH_TOKEN,
      });
      const userData: userInterface = {
        username: user.username,
        name: user.name,
      };
      const stringLog = `${user?.username} vừa đăng nhập.\nVào lúc: <b>${formatDate(
        new Date(),
      )}</b>\nIP người thực hiện: ${userIp}.`;
      request['message-log'] = stringLog;
      request['user'] = user;
      return {
        accressToken,
        refreshToken,
        userId: user._id,
        status: StatusResponse.SUCCESS,
        message: 'Login Success',
        data: userData,
      };
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new HttpException(
        {
          status: StatusResponse.FAIL,
          err,
        },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
