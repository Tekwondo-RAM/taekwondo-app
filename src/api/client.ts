const BASE_URL =
  window.__APP_CONFIG__?.baseURL ?? import.meta.env.VITE_BASE_URL;

if (!BASE_URL) {
  throw new Error(
    'baseURL is not configured (window.__APP_CONFIG__.baseURL or VITE_BASE_URL)'
  );
}

type HTTPMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

type ResponseType = 'json' | 'text' | 'blob';

type FetchOptions = Omit<RequestInit, 'body'> & {
  url: string;
  body?: Record<PropertyKey, unknown> | FormData;
  params?: Record<string, string | number | boolean | undefined>;
  responseType?: ResponseType;
  baseUrl?: string;
};

export class HTTPError extends Error {
  status: number;
  body?: unknown;
  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

const apiClient = <Resource>(
  method: HTTPMethod,
  {
    url,
    body,
    params,
    headers,
    responseType = 'json',
    baseUrl,
    ...options
  }: FetchOptions
): Promise<Resource> => {
  let finalUrl = `${baseUrl !== undefined ? baseUrl : BASE_URL}${url}`;
  if (params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    }
    const queryString = searchParams.toString();
    if (queryString) {
      finalUrl += `${finalUrl.includes('?') ? '&' : '?'}${queryString}`;
    }
  }

  return fetch(finalUrl, {
    method,
    ...(body && {
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
    headers: {
      ...(!(body instanceof FormData) && {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }),
      ...headers,
    },
    credentials: 'include',
    ...options,
  }).then(async (response) => {
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('isLogged');
        window.location.href = '/login';
        return new Promise<never>(() => {});
      }
      let errorBody: unknown;
      try {
        if (responseType === 'blob') {
          errorBody = await response.blob();
        } else if (responseType === 'text') {
          errorBody = await response.text();
        } else {
          const contentType = response.headers.get('content-type') ?? '';
          errorBody = contentType.includes('application/json')
            ? await response.json()
            : await response.text();
        }
      } catch {
        errorBody = undefined;
      }
      const message =
        typeof errorBody === 'object' && errorBody !== null
          ? 'error' in errorBody && typeof errorBody.error === 'string'
            ? errorBody.error
            : 'errors' in errorBody && Array.isArray(errorBody.errors)
              ? errorBody.errors.join(', ')
              : response.statusText
          : response.statusText;
      throw new HTTPError(message, response.status, errorBody);
    }

    if (responseType === 'blob') {
      return response.blob() as Promise<Resource>;
    }

    if (responseType === 'text') {
      return response.text() as Promise<Resource>;
    }

    return response.json() as Promise<Resource>;
  });
};

export const client = {
  get: <Resource>(options: FetchOptions): Promise<Resource> => {
    return apiClient<Resource>('GET', options);
  },
  post: <Resource>(options: FetchOptions): Promise<Resource> => {
    return apiClient<Resource>('POST', options);
  },
  patch: <Resource>(options: FetchOptions): Promise<Resource> => {
    return apiClient<Resource>('PATCH', options);
  },
  put: <Resource>(options: FetchOptions): Promise<Resource> => {
    return apiClient<Resource>('PUT', options);
  },
  delete: <Resource>(options: FetchOptions): Promise<Resource> => {
    return apiClient<Resource>('DELETE', options);
  },
};
