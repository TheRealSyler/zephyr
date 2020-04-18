import { POST } from './api';
import { route } from 'preact-router';
import { POST as POST_API } from './shared/api.POST';
import { AccessTokenPayload, UserRole } from './shared/utils.auth';
interface AuthData {
  accessToken: null | AccessTokenPayload;
  rawAccessToken: null | string;
}

export const AuthData: AuthData = {
  accessToken: null,
  rawAccessToken: null,
};

export const GuardRoutes = (loading: boolean) => {
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

export const RoleGuard = (role: UserRole) => {
  return (AuthData.accessToken?.role || 0) >= role;
};

export async function Login(username: string, password: string) {
  const res = await POST('auth/login', {
    username,
    password,
  });

  if (res.status === 200) {
    const success = decodeAccessToken(res.body.accessToken);
    if (success) {
      route('/home', true);
    }
    route('/home', true);
  }
  return res;
}

export async function SignUp({ username, password, email }: POST_API['auth/signUp']['body']) {
  const res = await POST('auth/signUp', {
    username,
    password,
    email,
  });

  if (res.status === 201) {
    const success = decodeAccessToken(res.body.accessToken);
    if (success) {
      route('/home', true);
    }
  }
  return res;
}
export async function LogOut() {
  await POST('auth/logout');
  AuthData.accessToken = null;

  route('/login', true);
}

export function decodeAccessToken(token: string) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as AccessTokenPayload;
    AuthData.accessToken = payload;
    AuthData.rawAccessToken = token;
    return payload;
  } catch {
    AuthData.accessToken = null;
    AuthData.rawAccessToken = null;
    route('/login', true);
    return false;
  }
}
