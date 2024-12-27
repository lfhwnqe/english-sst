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
      <div className="bg-white dark:bg-gray-900/90 backdrop-blur-sm shadow-[0_1px_3px_0_rgb(0,0,0,0.05)] dark:shadow-none">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                >
                  {item.name}
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
                <MenuIcon size={24} />
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-4 py-2 flex items-center justify-between">
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 rounded-lg bg-gray-100/80 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-700 transition-colors"
                >
                  {mounted &&
                    (theme === "dark" ? <Sun size={20} /> : <Moon size={20} />)}
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
          )}
        </nav>
      </div>
    </header>
  );
}

export default AppHeader;
