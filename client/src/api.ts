import { POST } from './shared/api.POST';
import { GET } from './shared/api.GET';
import querystring from 'querystring';
import { AuthData } from './auth';
import { DELETE } from './shared/api.DELETE';

const apiUrlBase = process.env.BASE_API_URL || 'http://localhost:3000/';

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
  query?: GET[K]['query']
): Promise<Response<GET[K]['response']>> {
  const headers: Headers = [];
  addAuthHeader(AuthData.rawAccessToken, headers);

  const res = await fetch(
    `${apiUrlBase}${path}${query ? '?' + querystring.stringify(query) : ''}`,
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

/**Note: The body has to be valid JSON. */
export async function DELETE<K extends keyof DELETE>(
  path: K,
  body?: DELETE[K]['body']
): Promise<Response<DELETE[K]['response']>> {
  const headers: Headers = [['Content-Type', 'application/json']];
  addAuthHeader(AuthData.rawAccessToken, headers);

  const res = await fetch(`${apiUrlBase}${path}`, {
    method: 'DELETE',
    body: JSON.stringify(body || {}),
    credentials: 'include',
    headers,
  });

  return {
    status: res.status,
    body: await res.json(),
  };
}
