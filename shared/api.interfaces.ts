export interface List {
  // TODO (used in GET)
}
export interface Movie {
  name: string;
  description: string;
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
