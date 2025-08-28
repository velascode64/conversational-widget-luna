import { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import { cn } from "@/lib/cn";

interface ChatWidgetLogoProps {
  src: string | undefined;
  className?: string;
}

function ChatWidgetLogo({ src, className }: ChatWidgetLogoProps) {
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsError(false);
  }, [src]);

  if (isError) {
    return null;
  }

  return (
    <Avatar
      className={cn(
        "h-8 w-8 min-w-0 shrink-0 grow-0 bg-[var(--chat-widget-primary)]",
        className
      )}
    >
      <AvatarImage
        src={src}
        className="bg-[var(--chat-widget-primary)]"
        onLoadingStatusChange={(status) => {
          if (status === "error") setIsError(true);
        }}
      />
      <AvatarFallback className="bg-[var(--chat-widget-primary)]">
        {null}
      </AvatarFallback>
    </Avatar>
  );
}

export default ChatWidgetLogo;
