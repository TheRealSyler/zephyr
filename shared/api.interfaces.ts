export interface List {
  name: string;
  description: string;
}
export interface Movie {
  name: string;
  description: string;
}

export interface MovieSuggestion {
  movie: Movie;
  suggestion: Movie;
  numberOfSuggestions: number;
}

export interface ListMovieItem {
  name: string;
  description?: string;
}

export interface ListItems {
  movies?: ListMovieItem[];
}

export type ListRemoveItems = {
  [key in keyof ListItems]: string[];
};

export interface SimpleUser {
  username: string;
  email: null | string;
}
