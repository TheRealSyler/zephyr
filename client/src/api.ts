import { POST } from './shared/api.POST';
import { GET } from './shared/api.GET';
import querystring from 'querystring';
import { AuthData } from './auth';

const apiUrlBase = 'http://localhost:3000/';

interface Response<T> {
  status: number;
  body: T;
}

type Headers = [string, string][];

function addAuthHeader(accessToken: null | string, headers: Headers) {
  if (accessToken) {
    headers.push(['Authorization', `Bearer ${accessToken}`]);
  }
}

export async function GET<K extends keyof GET>(
  path: K,
  params?: GET[K]['params']
): Promise<Response<GET[K]['response']>> {
  const headers: Headers = [];
  addAuthHeader(AuthData.rawAccessToken, headers);

  const res = await fetch(
    `${apiUrlBase}${path}${params ? '?' + querystring.stringify(params) : ''}`,
    {
      headers,
    }
  );
  return {
    status: res.status,
    body: await res.json(),
  };
}

/**Note: The body has to be valid JSON. */
export async function POST<K extends keyof POST>(
  path: K,
  body?: POST[K]['body']
): Promise<Response<POST[K]['response']>> {
  const headers: Headers = [['Content-Type', 'application/json']];
  addAuthHeader(AuthData.rawAccessToken, headers);

  const res = await fetch(`${apiUrlBase}${path}`, {
    method: 'POST',
    body: JSON.stringify(body || {}),
    credentials: 'include',
    headers,
  });

  return {
    status: res.status,
    body: await res.json(),
  };
}
