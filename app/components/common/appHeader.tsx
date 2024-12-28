"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Menu as MenuIcon, Sun, Moon } from "lucide-react";

function AppHeader() {
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  // 避免水合错误
  useEffect(() => setMounted(true), []);

  const navigation = [
    { name: "创作中心", href: "/audio-scene/create" },
    { name: "我的作品", href: "/audio-scene/list" },
  ];

  return (
    <header className="fixed w-full top-0 z-50">
      <div className="bg-gradient-to-r from-white via-white to-white/95 dark:from-gray-900/95 dark:via-gray-900/95 dark:to-gray-900/90 backdrop-blur-sm shadow-[0_1px_3px_0_rgb(0,0,0,0.05)] dark:shadow-none bg-[length:200%_200%] animate-gradient">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">
                MMC Audio
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative px-3 py-2 text-gray-600 dark:text-gray-300 transition-all duration-300 group hover:text-blue-500 dark:hover:text-blue-400"
                >
                  <span className="relative z-10">{item.name}</span>
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-blue-500/10 to-indigo-500/5 
                    dark:from-blue-400/5 dark:via-blue-400/10 dark:to-indigo-400/5 
                    opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg 
                    scale-90 group-hover:scale-100"
                  />
                </Link>
              ))}

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg bg-gray-100/80 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-700 transition-colors"
              >
                {mounted &&
                  (theme === "dark" ? <Sun size={20} /> : <Moon size={20} />)}
              </button>

              {/* Auth Buttons */}
              <Link
                href="/login"
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                登录
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm transition-all hover:shadow-md"
              >
                注册
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800 transition-colors"
              >
                <MenuIcon size={24} className={`transform transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Mobile Navigation - 修改定位和层级 */}
          <div 
            className={`
              absolute 
              left-0 
              right-0 
              top-full 
              md:hidden 
              transform 
              transition-all 
              duration-300 
              ease-in-out 
              origin-top
              ${isMenuOpen 
                ? 'opacity-100 scale-y-100 translate-y-0' 
                : 'opacity-0 scale-y-0 -translate-y-4 pointer-events-none'
              }
            `}
          >
            <div className="py-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 rounded-b-lg shadow-lg">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-4 py-3 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 rounded-lg bg-gray-100/80 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-700 transition-colors"
                >
                  {mounted && (theme === "dark" ? <Sun size={20} /> : <Moon size={20} />)}
                </button>
                <div className="space-x-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                  >
                    登录
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm transition-all hover:shadow-md"
                  >
                    注册
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default AppHeader;
