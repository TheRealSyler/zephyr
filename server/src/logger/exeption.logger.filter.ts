import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException
} from '@nestjs/common';
import { Request, Response } from 'express';
import { logRequest } from './logger';

@Catch(HttpException, UnauthorizedException, BadRequestException, InternalServerErrorException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(
    exception:
      | HttpException
      | UnauthorizedException
      | BadRequestException
      | InternalServerErrorException,
    host: ArgumentsHost
  ) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const status = exception.getStatus();

    logRequest({
      method: req.method,
      statusCode: status,
      url: req.url
    });

    res.status(status).json(exception.getResponse());
  }
}
