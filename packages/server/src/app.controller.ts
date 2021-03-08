import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('version')
  version(): string {
    return 'v0.0.1';
  }
}
