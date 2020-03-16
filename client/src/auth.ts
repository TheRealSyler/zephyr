import { Password } from 'suf-password';
import { POST } from './api';
import { useContext } from 'preact/hooks';
import { AuthContext } from './app';
import { route } from 'preact-router';

/**Check if the password is Strong. */
export function checkIsPasswordStrong(password: string) {
  //§ IMPORTANT, if you change this function also change the back end validation func.
  const res = Password.Validate(password, [{ type: 'uppercase' }, { type: 'numbers' }], {
    maxLength: 255,
    minLength: 7
  });
  if (!res.passed) {
    return res.errors;
  }
  return [];
}

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

interface UserAuthData {
  username: string;
  password: string;
  email: string | null;
}

export async function SignUp({ username, password, email }: UserAuthData) {
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
