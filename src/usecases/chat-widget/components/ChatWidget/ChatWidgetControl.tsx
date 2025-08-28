"use client";

import { cva } from "class-variance-authority";
import { ChevronDownIcon, MessageCircleIcon } from "lucide-react";
import { useMemo } from "react";

import { cn } from "@/lib/cn";

import {
  DEFAULT_PRIMARY_COLOR,
  DEFAULT_SECONDARY_COLOR,
} from "../../lib/constants";

const iconVariants = cva(
  "w-full h-full flex items-center justify-center transition-all duration-200",
  {
    variants: {
      opened: {
        true: "rotate-0 transform opacity-100",
        false: "-rotate-90 transform opacity-0",
      },
    },
    defaultVariants: {
      opened: false,
    },
  }
);

const messageIconVariants = cva(
  "absolute transition-all duration-200 w-full h-full flex items-center justify-center",
  {
    variants: {
      opened: {
        true: "scale-0 transform opacity-0",
        false: "scale-100 transform opacity-100",
      },
    },
    defaultVariants: {
      opened: false,
    },
  }
);

interface ChatWidgetControlProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  primaryColor?: string;
  secondaryColor?: string;
  opened?: boolean;
}

function ChatWidgetControl({
  primaryColor = DEFAULT_PRIMARY_COLOR,
  secondaryColor = DEFAULT_SECONDARY_COLOR,
  opened,
  className,
  type = "button",
  ...props
}: ChatWidgetControlProps) {
  const computedStyle = useMemo(() => {
    return {
      "--chat-widget-primary": primaryColor,
      "--chat-widget-secondary": secondaryColor,
    } as React.CSSProperties;
  }, [primaryColor, secondaryColor]);

  return (
    <button
      style={computedStyle}
      type={type}
      className={cn(
        "flex h-full w-full items-center justify-center whitespace-nowrap rounded-full bg-[var(--chat-widget-primary)] text-sm font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      <div className="relative h-full w-full">
        <div className={messageIconVariants({ opened })}>
          <MessageCircleIcon className="h-3/6 w-3/6" />
        </div>

        <div className={iconVariants({ opened })}>
          <ChevronDownIcon className="h-3/6 w-3/6" />
        </div>
      </div>
    </button>
  );
}

export default ChatWidgetControl;
