import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  UnauthorizedException
} from '@nestjs/common';
import { Request, Response } from 'express';
import { logRequest } from './logger';

@Catch(HttpException, UnauthorizedException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const status = exception.getStatus();

    logRequest({
      method: req.method,
      statusCode: status,
      url: req.url
    });

    response.status(status).json(exception.getResponse());
  }
}
