const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

interface FetchOptions extends RequestInit {
  needAuth?: boolean;
}

export async function fetchApi(endpoint: string, options: FetchOptions = {}) {
  const { needAuth = true, ...fetchOptions } = options;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...fetchOptions,
  };

  // 如果需要认证，添加 credentials
  if (needAuth) {
    defaultOptions.credentials = 'include';
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, defaultOptions);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'An error occurred');
  }

  return response.json();
} 