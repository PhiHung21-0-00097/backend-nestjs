import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { ActionEnum } from 'src/common/enums/ActionsRole.enum';
import { AuthGuard } from 'src/guard/auth.guard';
import { RolesGuard } from 'src/guard/role.guard';

export function Authorization(subject?: string, action?: ActionEnum) {
  return applyDecorators(
    SetMetadata('subject', subject),
    SetMetadata('action', action),
    UseGuards(AuthGuard, RolesGuard),
  );
}
