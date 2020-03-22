import { SimpleUser, ListItems } from './api.interfaces';

export interface POST {
  [key: string]: { body: any; response: any };
  'auth/login': {
    body: {
      username: string;
      password: string;
    };
    response: {
      accessToken: string;
      user: SimpleUser;
    };
  };
  'auth/logout': {
    body: {};
    response: {
      message: string;
      error: null;
    };
  };
  'auth/refreshToken': {
    body: {};
    response: {
      accessToken: string;
    };
  };
  'auth/signUp': {
    body: {
      username: string;
      email: string | null;
      password: string;
    };
    response: {
      errors: string[];
      message: string;
      user: SimpleUser;
      accessToken: string;
    };
  };
  'list/create': {
    body: {
      name: string;
      items: ListItems;
      description: string | null;
    };
    response: {};
  };
  'list/add': {
    body: {
      name: string;
      items: ListItems;
    };
    response: {};
  };
}
