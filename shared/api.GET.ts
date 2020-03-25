import { List } from './api.interfaces';

export interface GET {
  // DON'T Use [key: string]: { response: any }; the types in the front end will brake.
  // Reason: keyof POST won't work like expected because the keys are of type string.
  test: {
    response: {
      test: 'awd';
    };
    params: {};
  };
  list: {
    response: List[];
    params: {};
  };
}
