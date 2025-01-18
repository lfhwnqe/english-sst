"use client";
import { useEffect, useState, useRef } from "react";
import {
  Menu as MenuIcon,
  User,
  LogOut,
  Wallet,
} from "lucide-react";
import GradientButton from "@/components/common/GradientButton";
import { useHydrateAtoms } from "jotai/utils";
import { hasTokenAtom } from "@/app/stores/cookie";
import { injected, useAccount, useConnect, useDisconnect } from "wagmi";
import { formatAddress } from "@/utils";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";

function BaseHeader({ hasTokenServer }: { hasTokenServer: boolean }) {
  const t = useTranslations("Header");
  const params = useParams();
  const locale = (params.locale as string) || "zh-cn";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useHydrateAtoms([[hasTokenAtom, hasTokenServer]]);
  const account = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const handleLogin = async () => {
    connect({ connector: injected() });
  };

  const navigation = [
    { name: t("menu.addCourses"), href: `/${locale}/web3/course/add` },
    { name: t("menu.swap"), href: `/${locale}/web3/swap` },
    { name: t("menu.userCenter"), href: `/${locale}/web3/course/my` },
  ];

  // 认证相关按钮组件
  const AuthButtons = () => (
    <div className="w-[140px] flex items-center justify-end">
      <GradientButton onClick={handleLogin} className="px-4 py-1.5 w-full">
        <span className="text-sm whitespace-nowrap">{t("wallet.connect")}</span>
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
      <div className="w-[140px] flex justify-end relative" ref={dropdownRef}>
        <GradientButton
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-1.5 rounded-lg flex items-center justify-end w-full"
        >
          <span className="flex items-center whitespace-nowrap">
            <User size={16} className="mr-1.5" />
            <span className="text-sm">
              {formatAddress(account.address || "", 4)}
            </span>
          </span>
        </GradientButton>

        {/* 下拉菜单 */}
        {isOpen && (
          <div className="absolute right-0 top-full mt-1 w-[180px] rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 z-50">
            <div className="py-1">
              {/* 钱包信息 */}
              <div className="px-3 py-2 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center">
                  <Wallet size={14} className="mr-1.5" />
                  <span className="text-xs">{t("wallet.address")}</span>
                </div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 font-mono break-all">
                  {account.address}
                </div>
              </div>

              {/* 退出按钮 */}
              <button
                onClick={handleLogout}
                className="w-full px-3 py-1.5 text-sm text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
              >
                <LogOut size={14} className="mr-1.5" />
                <span className="text-xs">{t("wallet.disconnect")}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="">
      <nav className="mx-auto px-4 sm:px-6 lg:px-8 relative bg-white/50 dark:bg-black backdrop-blur-sm">
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-gray-200/50 via-blue-200/50 to-gray-200/50 dark:from-gray-800/50 dark:via-blue-900/50 dark:to-gray-800/50" />
        <div className="flex items-center h-16">
          {/* Logo */}
          <Link
            href={`/${locale}/web3`}
            className="flex items-center flex-shrink-0 mr-6"
          >
            <img
              src="/icon-192x192.png"
              alt="MMC Audio Logo"
              className="h-8 w-8"
            />
            <span className="ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">
              MMC Audio
            </span>
          </Link>

          {/* Desktop Navigation - 移到左边 */}
          <div className="hidden md:flex items-center space-x-2 flex-1">
            {navigation.map((item) => (
              <GradientButton 
                key={item.name} 
                href={item.href} 
                prefetch
                className="px-3 py-1.5"
              >
                <span className="text-sm whitespace-nowrap">{item.name}</span>
              </GradientButton>
            ))}
          </div>

          {/* Auth Section - 保持在右边 */}
          <div className="w-[140px] flex justify-end transition-all duration-300">
            {account.status === "connected" ? <UserInfo /> : <AuthButtons />}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden ml-2">
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
          </div>
        </div>
      </nav>
    </div>
  );
}
export default BaseHeader;

