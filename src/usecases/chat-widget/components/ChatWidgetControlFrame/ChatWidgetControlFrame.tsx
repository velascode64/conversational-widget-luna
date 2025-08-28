"use client";

import { useEffect, useState } from "react";

import type { ChatWidgetObj } from "@/lib/api/chats";

import { ChatWidgetControl } from "../ChatWidget";
import { ChatWidgetEvents } from "../../lib/constants";
import { useSendWidgetEvent } from "../../hooks/useSendWidgetEvent";
import { useListenWidgetEvents } from "../../hooks/useListenWidgetEvents";

interface ChatWidgetControlFrameProps {
  widgetId: string;
  widgetConfig: ChatWidgetObj;
}

export default function ChatWidgetControlFrame({
  widgetId,
  widgetConfig,
}: ChatWidgetControlFrameProps) {
  const [isOpened, setIsOpened] = useState(false);

  const sendWidgetEvent = useSendWidgetEvent();

  const handleClick = () => {
    if (isOpened) {
      sendWidgetEvent({
        widgetId,
        type: ChatWidgetEvents.CONTROL_CLOSE,
      });
    } else {
      sendWidgetEvent({
        widgetId,
        type: ChatWidgetEvents.CONTROL_OPEN,
      });
    }
  };

  useListenWidgetEvents({
    widgetId,
    onEvent: (type) => {
      if (type === ChatWidgetEvents.CHAT_CLOSED) {
        setIsOpened(false);
        return;
      }

      if (type === ChatWidgetEvents.CHAT_OPENED) {
        setIsOpened(true);
        return;
      }
    },
  });

  useEffect(() => {
    if (widgetId && widgetConfig) {
      sendWidgetEvent({
        widgetId,
        type: ChatWidgetEvents.CONTROL_LOADED_SUCCESS,
      });
    }
  }, [sendWidgetEvent, widgetConfig, widgetId]);

  return (
    <div className="h-full w-full rounded-full bg-transparent">
      <ChatWidgetControl
        primaryColor={widgetConfig.primary_color}
        secondaryColor={widgetConfig.secondary_color}
        opened={isOpened}
        onClick={handleClick}
      />
    </div>
  );
}
