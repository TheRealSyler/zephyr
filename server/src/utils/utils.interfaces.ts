import { Request as Req } from 'express';

export interface Request<T = {}> extends Req {
  body: T;
}
