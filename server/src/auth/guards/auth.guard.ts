import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException();
    }

    try {
      const token = authorization.split(' ')[1];

      const payload = verify(token, process.env.ACCESS_TOKEN_SECRET);

      console.log('AUTH GUARD PAYLOAD: ', payload);
    } catch (e) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
