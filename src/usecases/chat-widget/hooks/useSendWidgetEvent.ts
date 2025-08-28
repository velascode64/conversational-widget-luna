import { useCallback } from "react";

import { ChatWidgetEvents } from "../lib/constants";

interface SendWidgetEventParams {
  widgetId: string;
  type: ChatWidgetEvents;
}

export function useSendWidgetEvent() {
  const handleSendEvent = useCallback(
    ({ widgetId, type }: SendWidgetEventParams) => {
      window.parent?.postMessage(
        {
          widgetId,
          type,
        },
        "*"
      );
    },
    []
  );

  return handleSendEvent;
}
