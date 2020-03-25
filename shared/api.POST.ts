import { SimpleUser, ListItems, ListRemoveItems } from './api.interfaces';

export interface POST {
  // DON'T Use [key: string]: { body: any; response: any }; the types in the front end will brake.
  // Reason: keyof POST won't work like expected because the keys are of type string.
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
  'list/remove': {
    body: {
      name: string;
      items: ListRemoveItems;
    };
    response: {};
  };
}
