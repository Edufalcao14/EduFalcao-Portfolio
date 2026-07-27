import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ children, className, ...props }: ButtonProps) => {
  return (
    <button
      className={cn(
        'bg-emerald-600 py-2 px-3 md:py-3 md:px-4 rounded-lg text-sm md:text-base text-gray-50 flex items-center justify-center gap-2 hover:bg-emerald-500 transition-all disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
