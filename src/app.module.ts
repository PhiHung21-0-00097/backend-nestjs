import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/modules/users/user.module';
import { RoleModule } from 'src/modules/roles/roles.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/modules/auth/auth.module';
import { TestModule } from 'src/modules/test/test.module';
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: process.env.EXPIRES_ACCESS_TOKEN_JWT },
    }),
    UserModule,
    TestModule,
    // RoleModule,
    // AuthModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URL'),
        connectionFactory: (connection) => {
          // connection.plugin(softDeletePlugin);
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
