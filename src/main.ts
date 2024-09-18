import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Server } from 'http';
import { Handler, Context, Callback } from 'aws-lambda';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.enableCors({ origin: '*' });
//   app.useGlobalPipes(new ValidationPipe());
//   await app.listen(3333);
// }
// bootstrap();
let server: Server;

const bootstrapServer = async () => {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });
  await app.init();
  return app.getHttpAdapter().getInstance();
};

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrapServer());
  const response = await new Promise((resolve) => {
    server.emit('request', event, resolve);
  });
  return response;
};
