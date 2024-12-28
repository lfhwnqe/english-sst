"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface GradientButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export default function GradientButton({
  children,
  className = "",
  onClick,
  href,
  disabled = false,
  type = "button",
}: GradientButtonProps) {
  const baseStyles = `
    relative px-3 py-2 text-gray-800 dark:text-gray-300 
    transition-all duration-500 group 
    hover:text-blue-600 dark:hover:text-blue-400
    disabled:opacity-50 disabled:cursor-not-allowed
    rounded-lg
    bg-white/50 dark:bg-gray-800/50
    ring-1 ring-gray-200/50 dark:ring-gray-700/50
    hover:ring-blue-500/30 dark:hover:ring-blue-400/30
    backdrop-blur-sm
    ${className}
  `;

  const gradientOverlay = (
    <div
      className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-indigo-500/0
      dark:from-blue-400/0 dark:via-blue-400/20 dark:to-indigo-400/0
      opacity-0 group-hover:opacity-100
      before:absolute before:inset-0
      before:bg-gradient-to-r before:from-blue-500/5 before:via-blue-500/30 before:to-indigo-500/5
      dark:before:from-blue-400/5 dark:before:via-blue-400/30 dark:before:to-indigo-400/5
      before:translate-x-[-100%] group-hover:before:translate-x-[100%]
      before:transition-transform before:duration-700 before:ease-in-out
      after:absolute after:inset-0
      after:bg-gradient-to-r after:from-blue-500/10 after:via-blue-500/20 after:to-indigo-500/10
      dark:after:from-blue-400/10 dark:after:via-blue-400/20 dark:after:to-indigo-400/10
      after:opacity-0 group-hover:after:opacity-100
      after:transition-opacity after:duration-500 after:delay-300
      rounded-lg overflow-hidden
      shadow-[inset_0_0_0_0_rgba(59,130,246,0.1)] 
      group-hover:shadow-[inset_0_0_30px_rgba(59,130,246,0.2)]
      dark:group-hover:shadow-[inset_0_0_30px_rgba(96,165,250,0.2)]
      transition-all duration-500
      group-hover:scale-[1.02]"
    />
  );

  const content = (
    <>
      <span className="relative z-10 transition-colors duration-500">
        {children}
      </span>
      {!disabled && gradientOverlay}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={baseStyles} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={baseStyles}
      onClick={onClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
}
