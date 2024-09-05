import { Injectable } from '@nestjs/common';
@Injectable()
export class AuthService {
  // async signUp(user: CreateUserDto) {
  //   try {
  //     const hashPassword = await argon.hash(user.password);
  //     user.password = hashPassword;
  //     user.createdAt = new Date();
  //     user.id = 1;
  //     user.updatedAt = new Date();
  //     console.log(user);
  //     return CreateUserDto.planiToClass(user);
  //   } catch (err) {
  //     console.log('error: ', err);
  //   }
  // }

  signIn() {
    return [
      {
        x: 1,
        y: 2,
      },
    ];
  }
}
