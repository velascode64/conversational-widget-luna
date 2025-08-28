import { useEffect } from "react";

import { ChatWidgetEvents } from "../lib/constants";

interface UseListenWidgetEventsParams {
  widgetId: string;
  onEvent: (type: ChatWidgetEvents) => void;
}

export function useListenWidgetEvents({
  widgetId,
  onEvent,
}: UseListenWidgetEventsParams) {
  useEffect(() => {
    function handleEvent(ev: MessageEvent<Record<string, unknown>>) {
      if (ev.data?.widgetId !== widgetId) {
        return;
      }

      onEvent(ev.data.type as ChatWidgetEvents);
    }

    window.addEventListener("message", handleEvent);

    return () => {
      window.removeEventListener("message", handleEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widgetId]);
}
