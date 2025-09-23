"use client";

import { useMemo, useRef } from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { ChatWidgetContext, ChatWidgetContextState } from "./ChatWidgetContext";
import {
  DEFAULT_PRIMARY_COLOR,
  DEFAULT_SECONDARY_COLOR,
} from "../../lib/constants";

interface ChatWidgetProps {
  children: React.ReactNode;
  primaryColor?: string;
  secondaryColor?: string;
  watchAreaOffset?: number;
}

function ChatWidget({
  children,
  primaryColor = DEFAULT_PRIMARY_COLOR,
  secondaryColor = DEFAULT_SECONDARY_COLOR,
  watchAreaOffset = 100,
}: ChatWidgetProps) {
  const messagesScrollRef = useRef<React.ComponentRef<typeof ScrollAreaPrimitive.Root>>(null);

  const context = useMemo<ChatWidgetContextState>(
    () => ({
      watchAreaOffset,
      messagesScrollRef,
    }),
    [watchAreaOffset]
  );

  const computedStyle = useMemo(() => {
    return {
      "--chat-widget-primary": primaryColor,
      "--chat-widget-secondary": secondaryColor,
    } as React.CSSProperties;
  }, [primaryColor, secondaryColor]);

  return (
    <ChatWidgetContext.Provider value={context}>
      <div
        style={computedStyle}
        className="flex h-full w-full flex-col overflow-hidden bg-[var(--chat-widget-secondary)]"
      >
        {children}
      </div>
    </ChatWidgetContext.Provider>
  );
}

export default ChatWidget;
