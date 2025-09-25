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
  "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-200",
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
  "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 flex items-center justify-center",
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
  const computedStyle = useMemo(() => ({
    "width": "100%", "height": "100%",
    "--chat-widget-primary": primaryColor,
    "--chat-widget-secondary": secondaryColor,
  }) as React.CSSProperties, [primaryColor, secondaryColor]);

  return (
    <button
      style={computedStyle}
      type={type}
      className={cn(
        "relative h-12 w-12 aspect-square p-0 overflow-hidden rounded-full",
        "bg-[var(--chat-widget-primary)] text-white",
        "flex items-center justify-center transition-opacity hover:opacity-90",
        "focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      <div className="relative h-full w-full">
        {/* Wrappers no capturan clics */}
        <div className={cn(messageIconVariants({ opened }), "pointer-events-none")}>
          <MessageCircleIcon className="h-6 w-6" />
        </div>
        <div className={cn(iconVariants({ opened }), "pointer-events-none")}>
          <ChevronDownIcon className="h-6 w-6" />
        </div>
      </div>
    </button>
  );
}

export default ChatWidgetControl;
