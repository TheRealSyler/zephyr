import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  SetMetadata
} from '@nestjs/common';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';

import { AccessTokenPayload, UserRole } from 'src/shared/utils.auth';

export interface AuthRequest<T = {}> extends Request {
  token: AccessTokenPayload;
  body: T;
  /**Issued at date. */
  iat: number;
  /**Token expiry date. */
  exp: number;
}

export const Role = (role: UserRole) => SetMetadata('role', role);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException();
    }

    try {
      const token = authorization.split(' ')[1];

      const payload = verify(token, process.env.ACCESS_TOKEN_SECRET) as AccessTokenPayload;

      const requiredRole = this.reflector.get<UserRole | undefined>('role', context.getHandler());

      if ((requiredRole || 0) <= payload.role) {
        request.token = payload;
        return true;
      }
    } catch {}
    throw new UnauthorizedException();
  }
}
