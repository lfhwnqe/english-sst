import { atom } from "jotai";
import { setCookie } from "@/app/lib/cookies"; // 假设你有一个 cookie 工具库

// 创建主题相关的 atom
export const themeAtom = atom("light");

// 创建一个写入器 atom
export const setThemeAtom = atom(
  (get) => get(themeAtom),
  (get, set, newTheme: "light" | "dark") => {
    setCookie("theme", newTheme);
    set(themeAtom, newTheme);
  }
);
