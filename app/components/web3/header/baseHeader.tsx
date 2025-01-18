"use client";
import { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import {
  Menu as MenuIcon,
  Sun,
  Moon,
  User,
  LogOut,
  ChevronDown,
  Wallet,
} from "lucide-react";
import GradientButton from "@/components/common/GradientButton";
import { useHydrateAtoms } from "jotai/utils";
import { hasTokenAtom } from "@/app/stores/cookie";
import { useAtom } from "jotai";
import { themeAtom, setThemeAtom } from "@/app/stores/theme";
import { injected, useAccount, useConnect, useDisconnect } from "wagmi";
import { formatAddress } from "@/utils";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";

function BaseHeader({ hasTokenServer }: { hasTokenServer: boolean }) {
  const t = useTranslations("Header");
  const params = useParams();
  const locale = (params.locale as string) || "zh-cn";
  console.log("locale", locale);
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
  const account = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  // useEffect(() => {
  //   console.log(account)
  // }, [account])

  const handleLogin = async () => {
    connect({ connector: injected() });
  };

  const navigation = [
    { name: t("menu.courses"), href: `/${locale}/web3/course/add` },
    { name: t("menu.swap"), href: `/${locale}/web3/swap` },
    { name: t("menu.myNFTs"), href: `/${locale}/web3/course/my` },
  ];

  // 认证相关按钮组件
  const AuthButtons = () => (
    <div className="flex items-center space-x-2">
      <GradientButton onClick={handleLogin}>
        {t("wallet.connect")}
      </GradientButton>
    </div>
  );

  // 用户信息组件
  const UserInfo = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 点击外部关闭下拉菜单
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
      // 处理登出逻辑
      try {
        // 断开钱包连接等操作
        disconnect();
      } catch (error) {
        console.error("Logout error:", error);
      }
    };

    return (
      <div className="relative" ref={dropdownRef}>
        <GradientButton
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg flex items-center group"
        >
          <span className="flex items-center space-x-2">
            <User size={20} />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {formatAddress(account.address || "", 4)}
            </span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </span>
        </GradientButton>

        {/* 下拉菜单 */}
        <div
          className={`
            absolute right-0 mt-2  rounded-lg 
            bg-white dark:bg-gray-800 
            shadow-lg ring-1 ring-black ring-opacity-5 
            transition-all duration-200 ease-in-out
            ${
              isOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2 pointer-events-none"
            }
          `}
        >
          <div className="py-1">
            {/* 钱包信息 */}
            <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <Wallet size={16} />
                <span>{t("wallet.address")}</span>
              </div>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 font-mono">
                {account.address}
              </div>
            </div>

            {/* 退出按钮 */}
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-sm text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
            >
              <LogOut size={16} />
              <span>{t("wallet.disconnect")}</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="">
      <nav className="mx-auto px-4 sm:px-6 lg:px-8 relative bg-white/50 dark:bg-black backdrop-blur-sm">
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-gray-200/50 via-blue-200/50 to-gray-200/50 dark:from-gray-800/50 dark:via-blue-900/50 dark:to-gray-800/50" />
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}/web3`} className="flex items-center flex-shrink-0">
            <img src="/icon-192x192.png" alt="MMC Audio Logo" className="h-8 w-8" />
            <span className="ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">
              MMC Audio
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => (
              <GradientButton key={item.name} href={item.href} prefetch>
                {item.name}
              </GradientButton>
            ))}

            {/* Theme Toggle */}
            {/* <GradientButton
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </GradientButton> */}

            {/* Auth Section */}
            {account.status === "connected" ? <UserInfo /> : <AuthButtons />}
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
            {/* <div className="p-4 flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t("theme.switch")}
                </span>
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
            </div> */}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default BaseHeader;
