import { POST } from './api';
import { useContext } from 'preact/hooks';
import { AuthContext } from './app';
import { route } from 'preact-router';
import { POST as POST_API } from './shared/api.POST';

export const GuardRoutes = (auth: Partial<AuthContext>) => {
  switch (window.location.pathname) {
    case '/login':
    case '/signUp':
      if (!auth.loading && auth.accessToken) {
        route('/home', true);
      }
      break;

    default:
      if (!auth.loading && !auth.accessToken) {
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
    const authContext = useContext(AuthContext);
    authContext.setAccessToken(res.body.accessToken);

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
    const authContext = useContext(AuthContext);
    authContext.setAccessToken(res.body.accessToken);

    route('/home', true);
  }
  return res;
}
export async function LogOut() {
  await POST('auth/logout');

  const authContext = useContext(AuthContext);

  authContext.setAccessToken(null);

  route('/login', true);
}
