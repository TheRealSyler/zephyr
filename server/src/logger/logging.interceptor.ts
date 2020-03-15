import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { logRequest } from './logger';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    const now = Date.now();
    const log = () =>
      logRequest({
        method: req.method,
        statusCode: res.statusCode,
        url: req.url,
        time: now,
        headersSent: res.headersSent
      });
    return next.handle().pipe(tap(log));
  }
}
