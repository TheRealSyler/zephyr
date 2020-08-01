import { SimpleUser } from './api.interfaces';
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

  'user/setRole': {
    body: {
      newRole: UserRole;
      username?: string;
      adminPassword?: string;
    };
    response: SuccessResponse;
  };
  'article/publish': {
    body: {
      name: string;
      description?: string;
      content: string;
      title: string;
    };
    response: SuccessResponse;
  };
  'article/edit': {
    body: {
      name: string;
      content?: string;
      title?: string;
    };
    response: SuccessResponse;
  };
}
