import { Typography, TypographyProps } from "@mui/material";
import { ReactNode } from "react";

interface ThemeTextProps extends Omit<TypographyProps, "className"> {
  children: ReactNode;
  variant?: TypographyProps["variant"];
  secondary?: boolean;
  className?: string;
}

export default function ThemeText({
  children,
  variant = "body1",
  secondary = false,
  className = "",
  ...props
}: ThemeTextProps) {
  const baseClasses = secondary
    ? "text-gray-500 dark:text-gray-400" // 次要文本颜色
    : "text-gray-900 dark:text-gray-100"; // 主要文本颜色

  return (
    <Typography
      variant={variant}
      className={`${baseClasses} ${className}`}
      {...props}
    >
      {children}
    </Typography>
  );
} 