import * as React from "react";
import { cn } from "@/app/lib/utils";

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive";
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
          variant === "default" && "bg-background text-foreground",
          variant === "destructive" && "bg-destructive text-destructive-foreground",
          className
        )}
        {...props}
      />
    );
  }
);
Toast.displayName = "Toast";

export { Toast }; 