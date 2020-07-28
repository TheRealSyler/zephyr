import { SuccessResponse } from './api.response.success';

export interface DELETE {
  // DON'T Use [key: string]: { body: any; response: any }; the types in the front end will brake.
  // Reason: keyof POST won't work like expected because the keys are of type string.
  article: {
    body: {
      name: string;
    };
    response: SuccessResponse;
  };
}
