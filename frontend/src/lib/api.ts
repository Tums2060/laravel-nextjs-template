const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? 'http://localhost:8000';

type ApiOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: Record<string, unknown>;
};

async function parseJson<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') ?? '';

  if (!contentType.includes('application/json')) {
    return {} as T;
  }

  return (await response.json()) as T;
}

async function request<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await parseJson<Record<string, unknown>>(response);

  if (!response.ok) {
    const validationErrors =
      data.errors && typeof data.errors === 'object'
        ? Object.values(data.errors as Record<string, unknown[]>)
            .flat()
            .filter((value) => typeof value === 'string')
        : [];

    const message =
      (typeof data.message === 'string' && data.message) ||
      (validationErrors.length > 0
        ? validationErrors.join(', ')
        : 'Request failed. Check backend logs for details.');

    throw new Error(message);
  }

  return data as T;
}

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
};

export async function getCsrfCookie(): Promise<void> {
  await fetch(`${API_BASE_URL}/sanctum/csrf-cookie`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  });
}

export async function getCurrentUser(): Promise<AuthUser> {
  return request<AuthUser>('/api/auth/user');
}

export async function register(payload: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}): Promise<{ message: string; user: AuthUser }> {
  await getCsrfCookie();

  return request<{ message: string; user: AuthUser }>('/api/auth/register', {
    method: 'POST',
    body: payload,
  });
}

export async function login(payload: {
  email: string;
  password: string;
  remember?: boolean;
}): Promise<{ message: string; user: AuthUser }> {
  await getCsrfCookie();

  return request<{ message: string; user: AuthUser }>('/api/auth/login', {
    method: 'POST',
    body: payload,
  });
}

export async function logout(): Promise<{ message: string }> {
  await getCsrfCookie();

  return request<{ message: string }>('/api/auth/logout', {
    method: 'POST',
  });
}
