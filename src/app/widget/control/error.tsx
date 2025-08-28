"use client";

import { useEffect } from "react";

import { useSendWidgetEvent } from "@/usecases/chat-widget/hooks/useSendWidgetEvent";
import { ChatWidgetEvents } from "@/usecases/chat-widget/lib/constants";

function ChatWidgetControlErrorPage() {
  const sendWidgetEvent = useSendWidgetEvent();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const widgetId = searchParams.get("widget_id");

    if (widgetId) {
      sendWidgetEvent({
        widgetId,
        type: ChatWidgetEvents.CONTROL_LOADED_FAILURE,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export default ChatWidgetControlErrorPage;
