"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Menu as MenuIcon, Sun, Moon } from "lucide-react";
import GradientButton from "../GradientButton";

function BaseHeader() {
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
    <>
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
                <GradientButton key={item.name} href={item.href}>
                  {item.name}
                </GradientButton>
              ))}

              {/* Theme Toggle */}
              <GradientButton
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg"
              >
                {mounted &&
                  (theme === "dark" ? <Sun size={20} /> : <Moon size={20} />)}
              </GradientButton>

              {/* Auth Buttons */}
              <GradientButton href="/login">登录</GradientButton>
              <GradientButton
                href="/signup"
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm hover:shadow-md"
              >
                注册
              </GradientButton>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <GradientButton
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg"
              >
                <MenuIcon
                  size={24}
                  className={`transform transition-transform duration-300 ${isMenuOpen ? "rotate-180" : ""}`}
                />
              </GradientButton>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div
            className={`
              absolute left-0 right-0 top-full md:hidden 
              transform transition-all duration-300 ease-in-out origin-top
              ${
                isMenuOpen
                  ? "opacity-100 scale-y-100 translate-y-0"
                  : "opacity-0 scale-y-0 -translate-y-4 pointer-events-none"
              }
            `}
          >
            <div className="py-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 rounded-b-lg shadow-lg">
              {navigation.map((item) => (
                <GradientButton
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-left"
                >
                  {item.name}
                </GradientButton>
              ))}
              <div className="px-4 py-3 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
                <GradientButton
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 rounded-lg"
                >
                  {mounted &&
                    (theme === "dark" ? <Sun size={20} /> : <Moon size={20} />)}
                </GradientButton>
                <div className="space-x-2">
                  <GradientButton href="/login">登录</GradientButton>
                  <GradientButton
                    href="/signup"
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm hover:shadow-md"
                  >
                    注册
                  </GradientButton>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
export default BaseHeader;
