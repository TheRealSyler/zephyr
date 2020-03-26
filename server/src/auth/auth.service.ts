import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { sign } from 'jsonwebtoken';
import {
  checkIsPasswordStrong,
  AccessTokenPayload,
  RefreshTokenPayload
} from '../shared/utils.auth';

import { Response } from 'express';
import { getConnection } from 'typeorm';
import { verify } from 'argon2';
import { SimpleUser } from 'src/shared/api.interfaces';

@Injectable()
export class AuthService {
  constructor() {}

  /**Check if the username and password are empty and is password strong enough. */
  checkAreSignUpFieldsValid(password?: string, username?: string) {
    const errors: string[] = [];
    if (!password) {
      errors.push('Password is a required field.');
    } else {
      errors.push(...checkIsPasswordStrong(password));
    }
    if (!username) {
      errors.push('Username is a required field.');
    }
    return errors;
  }

  /**Check if there is an existing user with the same email or username. */
  async checkDoesUserExist(email: string, username: string) {
    const errors: string[] = [];

    const existingUser = await User.findOne({ where: [{ email }, { username }] });
    if (existingUser) {
      if (existingUser.email && existingUser.email === email) {
        errors.push('Email is already in use.');
      }
      if (existingUser.username === username) {
        errors.push('Username is already in use.');
      }
    }
    return errors;
  }

  /**Check if username and password are valid, returns a `User` if valid, throws if not valid `UnauthorizedException`*/
  async checkIsPasswordAndUsernameValid(username: string, password: string) {
    const user = await User.findOne({ where: { username } });

    if (user && (await verify(user.password, password))) {
      return user;
    }

    throw new UnauthorizedException();
  }

  /**Converts the A `User` to a user object that can be sent to the frontend. */
  convertUser(user: User): SimpleUser {
    return {
      username: user.username,
      email: user.email
    };
  }

  createAccessToken(user: User) {
    const payload: AccessTokenPayload = { username: user.username, role: user.role };
    return sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '15m'
    });
  }

  createRefreshToken(user: User) {
    const payload: RefreshTokenPayload = {
      username: user.username,
      tokenVersion: user.tokenVersion
    };
    return sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '7d'
    });
  }

  /**Sets the cookie of the Response.*/
  addRefreshTokenToRes(res: Response, token: string) {
    res.cookie('jid', token, {
      httpOnly: true,
      path: '/auth/refreshToken'
    });
  }

  /**Increase the tokenVersion  */
  async revokeRefreshTokensForUser(id: number) {
    await getConnection()
      .getRepository(User)
      .increment({ id }, 'tokenVersion', 1);

    return true;
  }
}
