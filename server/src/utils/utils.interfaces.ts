import { Request as Req } from 'express';

interface sObj {
  [key: string]: string;
}

export interface Request<Body extends {}, Query extends sObj> extends Req {
  body: Body;
  query: Query;
}
