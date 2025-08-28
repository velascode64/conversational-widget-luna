import { useCallback } from "react";

import { ScrollArea } from "@/components/ScrollArea";
import { useMergeRefs } from "@/lib/hooks/useMergeRefs";

import { useChatWidgetContext } from "./ChatWidgetContext";

interface ChatWidgetMessageListProps {
  children: React.ReactNode;
  scrollRef?: React.Ref<HTMLElement>;
}

function ChatWidgetMessageList({
  children,
  scrollRef,
}: ChatWidgetMessageListProps) {
  const { messagesScrollRef } = useChatWidgetContext();

  const mergedRef = useMergeRefs(messagesScrollRef, scrollRef);

  // Access the scrollable viewport element within the Radix UI ScrollArea component
  // The first child is the viewport wrapper, and its first child is the actual scrollable element
  const setScrollRef = useCallback(
    (element: HTMLDivElement) => {
      if (element?.children?.[1]) {
        mergedRef(element.children[1] as HTMLDivElement);
      }
    },
    [mergedRef]
  );

  return (
    <ScrollArea ref={setScrollRef} className="flex min-h-0 flex-1">
      <div className="flex flex-col gap-4 p-3">{children}</div>
    </ScrollArea>
  );
}

export default ChatWidgetMessageList;
