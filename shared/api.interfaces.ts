export interface Article {
  content: string;
  name: string;
  title: string;
  description?: string;
  changed: string | Date;
  created: string | Date;
  createdBy: string;
}

export interface SimpleUser {
  username: string;
  email: null | string;
}
