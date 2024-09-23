import { Body, Controller, Post } from '@nestjs/common';
import { TestService } from 'src/modules/test/test.service';

@Controller('tests')
export class TestController {
  constructor(private readonly testService: TestService) {}
}
