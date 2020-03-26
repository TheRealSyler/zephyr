import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import { AccessTokenPayload } from '../auth.service';

import { AccessTokenPayload } from 'src/shared/utils.auth';

export interface AuthRequest<T = {}> extends Request {
  token: AccessTokenPayload;
  body: T;
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException();
    }

    try {
      const token = authorization.split(' ')[1];

      const payload = verify(token, process.env.ACCESS_TOKEN_SECRET) as AccessTokenPayload;

      request.token = payload;
    } catch (e) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
