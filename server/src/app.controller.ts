import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth/guards/auth.guard';

@Controller()
export class AppController {
  @Get('/test')
  @UseGuards(AuthGuard)
  test() {
    return {
      test: 'awd'
    };
  }
}
