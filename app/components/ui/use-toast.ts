import { useCallback } from "react";

export type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
};

type ToastActionType = (props: ToastProps) => void;

export const useToast = (): { toast: ToastActionType } => {
  const toast: ToastActionType = useCallback((props: ToastProps) => {
    // 简单的 Toast 实现，使用 alert 实现基本功能
    // 在实际项目中，应该替换为更完善的 Toast 组件
    const { title, description, variant = "default" } = props;
    const message = title ? `${title}: ${description || ""}` : description;
    
    if (variant === "destructive") {
      console.error(message);
    } else {
      console.log(message);
    }
    
    alert(message);
  }, []);

  return { toast };
}; 