import { List, Movie, MovieSuggestion } from './api.interfaces';

export interface GET {
  // DON'T Use [key: string]: { response: any }; the types in the front end will brake.
  // Reason: keyof POST won't work like expected because the keys are of type string.
  test: {
    response: {
      test: 'awd';
    };
    params: {};
  };
  movie: {
    response: Movie;
    params: { name: string };
  };
  'movie/all': {
    response: Movie[];
    params: {};
  };
  'user/suggestions': {
    response: MovieSuggestion[];
    params: { username: string };
  };
  'user/list': {
    response: List[];
    params: { username: string };
  };
}
