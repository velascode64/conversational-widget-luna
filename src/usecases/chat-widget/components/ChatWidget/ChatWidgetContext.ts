import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { RefObject, createContext, useContext } from "react";

export interface ChatWidgetContextState {
  watchAreaOffset: number;
  messagesScrollRef: RefObject<
    React.ComponentRef<typeof ScrollAreaPrimitive.Root> | null
  >;
}

export const ChatWidgetContext = createContext<ChatWidgetContextState | null>(
  null
);

export function useChatWidgetContext() {
  const context = useContext(ChatWidgetContext);

  if (!context) {
    throw new Error(
      "useChatWidgetContext must be used within a <ChatWidget />"
    );
  }

  return context;
}
