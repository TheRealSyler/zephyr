import { Controller, Get, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
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
