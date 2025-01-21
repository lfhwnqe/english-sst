"use client";
import { useEffect, useState, useRef } from "react";
import {
  Menu as MenuIcon,
  User,
  LogOut,
  Wallet,
  Globe,
  ChevronDown,
} from "lucide-react";
import GradientButton from "@/components/common/GradientButton";
import { useHydrateAtoms } from "jotai/utils";
import { hasTokenAtom } from "@/app/stores/cookie";
import { injected, useAccount, useConnect, useDisconnect } from "wagmi";
import { formatAddress } from "@/utils";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";

function BaseHeader({ hasTokenServer }: { hasTokenServer: boolean }) {
  const t = useTranslations("Header");
  const params = useParams();
  const locale = (params.locale as string) || "zh-cn";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  useHydrateAtoms([[hasTokenAtom, hasTokenServer]]);
  const account = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const handleLogin = async () => {
    connect({ connector: injected() });
  };

  const navigation = [
    // { name: t("menu.addCourses"), href: `/${locale}/web3/course/add` },
    { name: t("menu.swap"), href: `/${locale}/web3/swap` },
    { name: t("menu.course"), href: `/${locale}/web3/course` },
    { name: t("menu.userCenter"), href: `/${locale}/web3/course/my` },
  ];

  // 语言选项
  const languages = [
    { code: 'zh-cn', name: '简体中文' },
    { code: 'en', name: 'English' }
  ];

  // 处理语言切换
  const handleLanguageChange = (langCode: string) => {
    // 获取当前完整路径
    const pathname = window.location.pathname;
    // 将当前路径按 '/' 分割
    const pathSegments = pathname.split('/');
    // 替换 locale 部分（第一个段）
    pathSegments[1] = langCode;
    // 重新组合路径
    const newPath = pathSegments.join('/');
    // 导航到新路径
    router.push(newPath);
  };

  // 认证相关按钮组件
  const AuthButtons = () => (
    <div className="w-[160px] flex items-center justify-end">
      <GradientButton onClick={handleLogin} className="px-4 py-1.5 w-full">
        <span className="text-sm whitespace-nowrap">{t("wallet.connect")}</span>
      </GradientButton>
    </div>
  );

  // 用户信息组件
  const UserInfo = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 点击外部关闭下拉菜单
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setIsLangMenuOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
      try {
        disconnect();
      } catch (error) {
        console.error("Logout error:", error);
      }
    };

    return (
      <div className="w-[160px] flex justify-end relative" ref={dropdownRef}>
        <GradientButton
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-1.5 rounded-lg flex items-center justify-end w-full"
        >
          <span className="flex items-center whitespace-nowrap">
            <User size={16} className="mr-2" />
            <span className="text-sm">
              {formatAddress(account.address || "", 4)}
            </span>
          </span>
        </GradientButton>

        {/* 下拉菜单 */}
        <div className={`
          absolute right-0 top-full mt-1 min-w-[320px] max-w-[400px] w-max 
          rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 z-50
          transform transition-all duration-200 ease-out origin-top
          ${isOpen 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
          }
        `}>
          <div className="py-1">
            {/* 钱包信息 */}
            <div className="px-3 py-2 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center">
                <Wallet size={14} className="mr-1.5 flex-shrink-0" />
                <span className="text-xs">{t("wallet.address")}</span>
              </div>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 font-mono break-all">
                {account.address}
              </div>
            </div>

            {/* 用户中心 */}
            <Link
              href={`/${locale}/web3/course/my`}
              className="w-full px-3 py-1.5 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
            >
              <User size={14} className="mr-1.5 flex-shrink-0" />
              <span className="text-xs">{t("menu.userCenter")}</span>
            </Link>

            {/* 语言切换 */}
            <div className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="w-full flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 rounded py-1.5"
              >
                <div className="flex items-center px-3">
                  <Globe size={14} className="mr-1.5 flex-shrink-0" />
                  <span className="text-xs">{t("language")}</span>
                </div>
                <div className="flex items-center px-3">
                  <span className="text-xs mr-1">
                    {languages.find(lang => lang.code === locale)?.name}
                  </span>
                  <ChevronDown 
                    size={14} 
                    className={`transform transition-transform duration-200 ${
                      isLangMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>
              
              {/* 语言选项下拉菜单 */}
              <div className={`
                mt-1 overflow-hidden transition-all duration-200
                ${isLangMenuOpen ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}
              `}>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      handleLanguageChange(lang.code);
                      setIsLangMenuOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 text-xs text-left rounded hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      locale === lang.code ? 'bg-gray-50 dark:bg-gray-700' : ''
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 退出按钮 */}
            <button
              onClick={handleLogout}
              className="w-full px-3 py-1.5 text-sm text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center border-t border-gray-100 dark:border-gray-700"
            >
              <LogOut size={14} className="mr-1.5 flex-shrink-0" />
              <span className="text-xs">{t("wallet.disconnect")}</span>
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
            {navigation.filter(item => item.name !== t("menu.userCenter")).map((item) => (
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

          {/* Auth Section */}
          <div className="flex items-center">
            <div className="w-[160px] flex justify-end transition-all duration-300">
              {account.status === "connected" ? <UserInfo /> : <AuthButtons />}
            </div>
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

