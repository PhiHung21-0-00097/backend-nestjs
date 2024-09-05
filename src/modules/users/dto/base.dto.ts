import { Expose, plainToInstance } from 'class-transformer';

export abstract class BaseDto {
  @Expose()
  id: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  static planiToClass<T>(this: new (...args: any[]) => T, obj: T): T {
    return plainToInstance(this, obj, {
      excludeExtraneousValues: true,
    });
  }
}
