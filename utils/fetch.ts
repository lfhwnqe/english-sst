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
    // 处理 401 未授权错误
    if (response.status === 401) {
      // 如果在客户端环境
      if (typeof window !== 'undefined') {
        // 保存当前URL，以便登录后返回
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