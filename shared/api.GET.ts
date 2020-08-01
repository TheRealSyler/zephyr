import { Article } from './api.interfaces';

export interface GET {
  // DON'T Use [key: string]: { response: any }; the types in the front end will brake.
  // Reason: keyof POST won't work like expected because the keys are of type string.
  test: {
    response: {
      test: 'awd';
    };
    query: {};
  };
  article: {
    response: Article | Article[];
    query: {
      name?: string;
      user?: string;
      sort?: 'newest' | 'oldest';
      page?: string;
      /**Results per page defaults to 10 */
      results?: string;
    };
  };
}
