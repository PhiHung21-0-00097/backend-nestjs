// logging.decorator.ts

import { SetMetadata, applyDecorators } from '@nestjs/common';
import { ActionLogEnum } from 'src/common/enums/ActionLog.enum';
import { SubjectEnum } from 'src/common/enums/SubjectRoles.enum';

export const Logging = (
  action_name: string,
  action: ActionLogEnum,
  subject: SubjectEnum,
  _params?: string[],
) => {
  return applyDecorators(
    SetMetadata('action_name', action_name),
    SetMetadata('action', action),
    SetMetadata('subject', subject),
    SetMetadata('_params', _params),
  );
};
