export interface List {}

export interface ListMovieItem {
  name: string;
  description?: string;
}

export interface ListItems {
  movies?: ListMovieItem[];
}

export interface SimpleUser {
  username: string;
  email: null | string;
}
