"use client";
import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Menu as MenuIcon, Sun, Moon, User, LogOut } from "lucide-react";
import GradientButton from "../GradientButton";
import { useHydrateAtoms } from "jotai/utils";
import { hasTokenAtom } from "@/app/stores/cookie";
import { useAtom } from "jotai";
import { themeAtom, setThemeAtom } from "@/app/stores/theme";

function BaseHeader({ hasTokenServer }: { hasTokenServer: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useHydrateAtoms([[hasTokenAtom, hasTokenServer]]);
  const [hasToken] = useAtom(hasTokenAtom);
  const [theme] = useAtom(themeAtom);
  const [, setThemeInAtom] = useAtom(setThemeAtom);
  const { setTheme: setThemeNext } = useTheme();
  
  const setTheme = (newTheme: "light" | "dark") => {
    setThemeNext(newTheme);
    setThemeInAtom(newTheme);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('登出失败');
      }

      // 清除本地存储
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("idToken");

      // 刷新页面以重置所有状态
      window.location.href = "/";
    } catch (error) {
      console.error('Logout error:', error);
      // 可以添加错误提示
      alert('登出失败，请重试');
    }
  };

  const navigation = [
    { name: "创作中心", href: "/audio-scene/create" },
    { name: "我的作品", href: "/audio-scene/list" },
  ];

  // 认证相关按钮组件
  const AuthButtons = () => (
    <div className="flex items-center space-x-2">
      <GradientButton href="/auth/login">登录</GradientButton>
      <GradientButton
        href="/auth/signup"
        className="bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-600 dark:to-indigo-600 
        text-white hover:text-white dark:hover:text-white font-semibold 
        shadow-lg hover:shadow-xl hover:shadow-blue-500/20
        border-none ring-0"
      >
        注册
      </GradientButton>
    </div>
  );

  // 用户信息组件
  const UserInfo = () => (
    <div className="flex items-center space-x-2">
      <GradientButton href="/audio-scene/list" className="p-2 rounded-full">
        <User size={20} />
      </GradientButton>
      <GradientButton
        onClick={handleLogout}
        className="p-2 rounded-full text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
      >
        <LogOut size={20} />
      </GradientButton>
    </div>
  );

  return (
    <div className="bg-gradient-to-r from-white via-white to-white/95 dark:from-gray-900/95 dark:via-gray-900/95 dark:to-gray-900/90 backdrop-blur-sm shadow-[0_1px_3px_0_rgb(0,0,0,0.05)] dark:shadow-none bg-[length:200%_200%] animate-gradient">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
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
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </GradientButton>

            {/* Auth Section */}
            {hasToken ? <UserInfo /> : <AuthButtons />}
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
            fixed inset-x-0 top-[64px] md:hidden 
            transform transition-all duration-300 ease-in-out origin-top
            ${
              isMenuOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4 pointer-events-none"
            }
          `}
        >
          <div className="mx-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg shadow-lg divide-y divide-gray-100 dark:divide-gray-800">
            {/* Navigation Links */}
            <div className="py-2">
              {navigation.map((item) => (
                <GradientButton
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {item.name}
                </GradientButton>
              ))}
            </div>

            {/* Theme and Auth */}
            <div className="p-4 flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">主题切换</span>
                <GradientButton
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 rounded-lg"
                >
                  {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                </GradientButton>
              </div>
              <div className="flex justify-end">
                {hasToken ? <UserInfo /> : <AuthButtons />}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default BaseHeader;
