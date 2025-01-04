import Cookies from 'js-cookie';

export function getCookie(name: string): string | null {
  const ret = Cookies.get(name) || null;
  console.log(`getCookie ret ${name}:`, ret);
  return ret;
}

export function setCookie(name: string, value: string, days = 365) {
  Cookies.set(name, value, { expires: days, sameSite: 'Lax' });
}

export function removeCookie(name: string) {
  Cookies.remove(name);
} 