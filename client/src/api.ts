import { AuthContext } from './app';
import { useContext } from 'preact/hooks';

const apiUrlBase = 'http://localhost:3000/';

type POST_PATHS = 'auth/login' | 'auth/signUp' | 'auth/refreshToken' | 'auth/logout';
type GET_PATHS = 'test';

interface Response {
  status: number;
  body: any;
}

type Headers = [string, string][];

function addAuthHeader(accessToken: null | string, headers: Headers) {
  if (accessToken) {
    headers.push(['Authorization', `Bearer ${accessToken}`]);
  }
}

export async function GET(path: GET_PATHS): Promise<Response> {
  const authContext = useContext(AuthContext);
  const headers: Headers = [];
  addAuthHeader(authContext.accessToken, headers);

  const res = await fetch(`${apiUrlBase}${path}`, {
    headers
  });
  return {
    status: res.status,
    body: await res.json()
  };
}

/**Note: The body has to be valid JSON. */
export async function POST<T>(path: POST_PATHS, body?: T): Promise<Response> {
  const authContext = useContext(AuthContext);

  const headers: Headers = [['Content-Type', 'application/json']];
  addAuthHeader(authContext.accessToken, headers);

  const res = await fetch(`${apiUrlBase}${path}`, {
    method: 'POST',
    body: JSON.stringify(body || {}),
    credentials: 'include',
    headers
  });

  return {
    status: res.status,
    body: await res.json()
  };
}
