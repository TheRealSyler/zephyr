import { SuccessResponse } from './api.response.success';

export interface DELETE {
  [key: string]: { body: any; response: any };
  list: {
    body: {
      name: string;
    };
    response: SuccessResponse;
  };
}
