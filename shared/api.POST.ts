import { SimpleUser, ListItems, ListRemoveItems, Movie } from './api.interfaces';
import { UserRole } from './utils.auth';
import { SuccessResponse } from './api.response.success';

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
  'movie/create': {
    body: Partial<Movie>;
    response: {};
  };
  'movie/edit': {
    body: Partial<Movie>;
    response: {};
  };
  'movie/suggest': {
    body: {
      movie: string;
      suggestion: string;
      addToSuggested: boolean;
    };
    response: {};
  };
  'user/setRole': {
    body: {
      newRole: UserRole;
      username?: string;
      adminPassword?: string;
    };
    response: SuccessResponse;
  };
}
