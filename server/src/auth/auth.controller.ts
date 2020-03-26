import {
  Controller,
  Post,
  Req,
  HttpStatus,
  Res,
  HttpCode,
  Body,
  BadRequestException
} from '@nestjs/common';
import { User } from 'src/entities/user.entity';

import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { verify } from 'jsonwebtoken';
import { POST } from 'src/shared/api.POST';
import { RefreshTokenPayload } from 'src/shared/utils.auth';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(
    @Body() body: Partial<POST['auth/login']['body']>,
    @Res() res: Response<POST['auth/login']['response']>
  ) {
    const { username, password } = body;
    if (!username || !password) {
      throw new BadRequestException();
    }
    const user = await this.authService.checkIsPasswordAndUsernameValid(username, password);

    this.authService.addRefreshTokenToRes(res, this.authService.createRefreshToken(user));

    res.send({
      accessToken: this.authService.createAccessToken(user),
      user: this.authService.convertUser(user)
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  async logout(@Res() res: Response<POST['auth/logout']['response']>) {
    this.authService.addRefreshTokenToRes(res, '');
    res.send({
      message: 'Logged out Successfully',
      error: null
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('/refreshToken')
  async refreshToken(
    @Req() req: Request,
    @Res() res: Response<POST['auth/refreshToken']['response']>
  ) {
    const token = req.cookies.jid;
    if (!token) {
      throw new BadRequestException();
    }

    try {
      // use var because function scope meme, the only time var is allowed in my code.
      var payload = verify(token, process.env.REFRESH_TOKEN_SECRET) as RefreshTokenPayload;
    } catch (err) {
      throw new BadRequestException();
    }

    const user = await User.findOne({ username: payload.username });

    if (!user) {
      throw new BadRequestException();
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      throw new BadRequestException();
    }

    this.authService.addRefreshTokenToRes(res, this.authService.createRefreshToken(user));

    res.send({ accessToken: this.authService.createAccessToken(user) });
  }

  @Post('/signUp')
  async singUp(
    @Body() body: Partial<POST['auth/signUp']['body']>,
    @Res() res: Response<POST['auth/signUp']['response']>
  ) {
    const { email, password, username } = body;

    let message = 'Internal Server Error';
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let userData = null;
    let accessToken: string = null;
    const errors: string[] = [];

    errors.push(...this.authService.checkAreSignUpFieldsValid(password, username));

    errors.push(...(await this.authService.checkDoesUserExist(email, username)));

    if (errors.length > 0) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Sign Up Failed.';
      res.status(status);
      res.send({ errors, message, user: null, accessToken });
      return;
    }

    try {
      const user = User.create({ email, password, username });

      await user.save();

      this.authService.addRefreshTokenToRes(res, this.authService.createRefreshToken(user));
      userData = this.authService.convertUser(user);
      accessToken = this.authService.createAccessToken(user);
      status = HttpStatus.CREATED;
      message = 'Successfully Signed Up.';
    } catch (e) {
      errors.push('Server Error, please try Again.');
      message = 'Internal Server Error';
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    res.status(status);
    res.send({ errors, message, user: userData, accessToken });
  }
}
