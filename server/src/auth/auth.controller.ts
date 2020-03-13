import { Controller, UseGuards, Post, Req, HttpStatus, Res, HttpCode } from '@nestjs/common';
import { LocalAuthGuard } from './auth.local.guard';
import { User } from 'src/users/users.entity';

import { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Req() req: Request) {
    return req.user;
  }

  @Post('/signUp')
  async singUp(@Req() req: Request, @Res() res: Response) {
    const { email, password, username } = req.body;

    let message = 'Internal Server Error';
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let userRes = {};
    const errors: string[] = [];

    if (password) {
      errors.push(...this.authService.checkPassword(password));
    } else {
      errors.push('Password is a required field.');
    }
    if (!username) {
      errors.push('Username is a required field.');
    }

    const existingUser = await User.findOne({ where: [{ email }, { username }] });

    if (existingUser) {
      if (existingUser.email && existingUser.email === email) {
        errors.push('Email is already in use.');
      }

      if (existingUser.username === username) {
        errors.push('Username is already in use.');
      }
    }

    if (errors.length > 0) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Sign Up Failed.';
    } else {
      try {
        const user = User.create({ email, password, username });

        const { id, password: n, ...userData } = await user.save();
        userRes = userData;
        status = HttpStatus.CREATED;
        message = 'Successfully Signed Up.';
      } catch (e) {
        errors.push('Server Error, please try Again.');
        message = 'Internal Server Error';
        status = HttpStatus.INTERNAL_SERVER_ERROR;
      }
    }

    res.status(status);
    res.send({ errors, message, user: userRes });
  }
}
