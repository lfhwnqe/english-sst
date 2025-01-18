import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export default function Home() {
  // 从请求头中获取当前语言
  const headersList = headers();
  const pathname = headersList.get('x-pathname') || '';
  
  // 获取当前语言前缀
  const locale = pathname.split('/')[1] || 'zh-cn';
  
  // 重定向到对应语言的 web3 页面
  redirect(`/${locale}/web3`);
}