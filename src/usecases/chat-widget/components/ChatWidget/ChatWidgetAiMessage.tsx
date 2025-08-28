"use client";

import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { BotIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Components } from "react-markdown";

import { Markdown } from "@/components/Markdown";
import { Avatar } from "@/components/Avatar";
import { StreamableValue } from "@/lib/streaming";
import { cn } from "@/lib/cn";

import { useChatWidgetContext } from "./ChatWidgetContext";
import { isScrollToBottom } from "./utils";

interface ChatWidgetBotMessageProps {
  content: string | StreamableValue;
  logoSrc?: string;
  className?: string;
}

const COMPONENTS: Partial<Components> = {
  p({ children }) {
    return <p className="text-sm">{children}</p>;
  },
  ol({ children }) {
    return <ol className="list-decimal">{children}</ol>;
  },
  ul({ children }) {
    return <ul className="list-disc">{children}</ul>;
  },
  a({ children, href, className }) {
    return (
      <a
        href={href}
        target="_blank"
        className={cn("text-[var(--chat-widget-primary)] underline", className)}
      >
        {children}
      </a>
    );
  },
};

function ChatWidgetAiMessage({
  content,
  logoSrc,
  className,
}: ChatWidgetBotMessageProps) {
  const { watchAreaOffset, messagesScrollRef } = useChatWidgetContext();

  const [text, setText] = useState(() => {
    return typeof content === "string" ? content : "";
  });

  useEffect(() => {
    async function readValue(content: StreamableValue) {
      for await (const chunk of content) {
        setText((prev) => prev + chunk);

        if (
          messagesScrollRef.current &&
          isScrollToBottom(messagesScrollRef.current, watchAreaOffset)
        ) {
          setTimeout(() => {
            messagesScrollRef.current?.scrollTo({
              top: messagesScrollRef.current.scrollHeight,
              behavior: "smooth",
            });
          }, 100);
        }
      }
    }

    if (content && typeof content !== "string") {
      readValue(content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  return (
    <div
      className={cn(
        "relative flex items-start justify-start pl-10 pr-4",
        className
      )}
    >
      <Avatar className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full">
        <AvatarImage src={logoSrc} />

        <AvatarFallback className="flex h-8 w-8 items-center justify-center bg-[var(--chat-widget-primary)] text-white">
          <BotIcon size={20} />
        </AvatarFallback>
      </Avatar>

      <div className="max-w-[280px] overflow-hidden px-1 py-2 prose-sm break-words text-black prose-p:leading-relaxed prose-pre:p-0">
        <Markdown components={COMPONENTS}>{text}</Markdown>
      </div>
    </div>
  );
}

export default ChatWidgetAiMessage;
