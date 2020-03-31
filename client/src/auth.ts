import { POST } from './api';
import { useContext } from 'preact/hooks';
import { route } from 'preact-router';
import { POST as POST_API } from './shared/api.POST';

interface AuthData {
  accessToken: null | string;
}

export const AuthData: AuthData = {
  accessToken: null
};

export const GuardRoutes = (loading: boolean) => {
  console.log(loading, window.location.pathname);
  switch (window.location.pathname) {
    case '/login':
    case '/signUp':
      if (!loading && AuthData.accessToken) {
        route('/home', true);
      }
      break;

    default:
      if (!loading && !AuthData.accessToken) {
        route('/login', true);
      }
      break;
  }
};

export async function Login(username: string, password: string) {
  const res = await POST('auth/login', {
    username,
    password
  });

  if (res.status === 200) {
    AuthData.accessToken = res.body.accessToken;

    route('/home', true);
  }
  return res;
}

export async function SignUp({ username, password, email }: POST_API['auth/signUp']['body']) {
  const res = await POST('auth/signUp', {
    username,
    password,
    email
  });

  if (res.status === 201) {
    AuthData.accessToken = res.body.accessToken;

    route('/home', true);
  }
  return res;
}
export async function LogOut() {
  await POST('auth/logout');
  AuthData.accessToken = null;

  route('/login', true);
}
