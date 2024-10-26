export function getBaseUrl() {
    if (process.env.NODE_ENV === 'development') {
      return 'http://localhost:3000';
    }
    
    // Cloudflare Pages URL
    if (process.env.CF_PAGES) {
      return `https://${process.env.CF_PAGES_URL}`;
    }
    
    // 回退到环境变量中的 URL
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }