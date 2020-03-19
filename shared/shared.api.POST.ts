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
      email: string;
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
      username: string;
      listName: string;
      items: string[];
      description: string;
    };
    response: {
      username: string;
      listName: string;
      items: string[];
      description: string;
    };
  };
}

export interface SimpleUser {
  username: string;
  email: null | string;
}
