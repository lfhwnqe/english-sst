interface FetchOptions extends RequestInit {
  needAuth?: boolean;
}

export async function fetchApi(endpoint: string, options: FetchOptions = {}) {
  const { needAuth = true, ...fetchOptions } = options;
  
  // 确保所有请求都通过 Next.js API 路由
  const apiEndpoint = endpoint.startsWith('/api/') ? endpoint : `/api${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
    ...fetchOptions,
  };

  console.log('Client fetch request:', {
    url: apiEndpoint,
    method: defaultOptions.method || 'GET'
  });

  const response = await fetch(apiEndpoint, defaultOptions);

  if (!response.ok) {
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        if (currentPath !== '/login') {
          window.localStorage.setItem('redirectAfterLogin', currentPath);
          window.location.href = '/login';
        }
      }
    }

    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'An error occurred');
  }

  return response.json();
} 