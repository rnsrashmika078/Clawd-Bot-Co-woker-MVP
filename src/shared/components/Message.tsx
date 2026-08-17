import React, { forwardRef, HTMLAttributes, memo, ReactNode } from "react";
interface MessageProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  align?: "start" | "end";
  visibility?: boolean;
}
export const Message = memo(
  forwardRef<HTMLDivElement, MessageProps>(
    (
      { visibility = true, className, align = "start", children, ...rest },
      ref,
    ) => {
      if (!visibility) return;
      const alignment = {
        start: "items-start justify-start",
        end: "items-end justify-end",
      };
      return (
        <div
          ref={ref}
          {...rest}
          className={`flex  w-full ${alignment[align]} ${className}`}
        >
          {children}
        </div>
      );
    },
  ),
);

Message.displayName = "Message";

interface BubbleProps {
  children?: ReactNode;
  variant?: "human" | "ai";
}

export const Bubble = ({ children, variant = "human" }: BubbleProps) => {
  const variants = {
    human: "bg-primary text-background p-2 rounded-xl",
    ai: "bg-transparent",
  };

  return (
    <div className={`${variant === "ai" ? "w-full" : ""} ${variants[variant]}`}>
      {children}
    </div>
  );
};
