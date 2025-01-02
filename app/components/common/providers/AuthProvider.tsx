'use client';
import { useAtom } from 'jotai';
import { hasTokenAtom } from '@/app/stores/cookie';

export default function AuthProvider({ 
  hasToken, 
  children 
}: { 
  hasToken: boolean;
  children: React.ReactNode;
}) {
  const [, setHasToken] = useAtom(hasTokenAtom);
  setHasToken(hasToken);

  return <>{children}</>;
} 